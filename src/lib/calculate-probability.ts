// import type { StateProbabilities } from "@/data/state-probabilities";

import { electoralVotes } from "@/data/electoral-votes";
import type { StateProbabilities, StateProbability } from "@/data/state-probabilities";
import type { State } from "@/data/static-state-data";
import { senate2026Incumbents } from "@/data/senate-2026";
// import { defaultSafeStates, safeStateResults } from "@/data/state-probabilities";

export type FinalProbability = {
  R: number;
  D: number;
  draw: number;
};

export const calculateProbability = (stateProbabilities: StateProbabilities): FinalProbability | null => {
  const swingStates: string[] = [];
  let safeTrumpVotes = 0;
  let safeHarrisVotes = 0;

  for (const [state, prob] of Object.entries(stateProbabilities)) {
    if (prob === null) {
      return null;
    }
    const republicanProbability = (prob.leftCandidateParty === "R" ? prob.leftCandidate : 0)
      + (prob.rightCandidateParty === "R" ? prob.rightCandidate : 0);
    const democraticProbability = (prob.leftCandidateParty === "D" ? prob.leftCandidate : 0)
      + (prob.rightCandidateParty === "D" ? prob.rightCandidate : 0);
    if (republicanProbability !== 1 && democraticProbability !== 1) {
      swingStates.push(state);
    } else if (republicanProbability === 1) {
      safeTrumpVotes += electoralVotes[state as State];
    } else if (democraticProbability === 1) {
      safeHarrisVotes += electoralVotes[state as State];
    }
  }

  // Generate all possible combinations of 'D' and 'R' for swing states
  const arrangements: Array<Record<string, "D" | "R">> = [];

  const numSwingStates = swingStates.length;
  const totalArrangements = 1 << numSwingStates; // 2^numSwingStates

  // Create a list of every possible swing state outcome arrangement
  for (let i = 0; i < totalArrangements; i++) {
    const arrangement: Record<string, "D" | "R"> = {} as Record<string, "D" | "R">;
    for (let j = 0; j < numSwingStates; j++) {
      const state = swingStates[j];
      arrangement[state] = i & (1 << j) ? "R" : "D";
    }
    arrangements.push(arrangement);
  }

  let harrisProbability = 0;
  let trumpProbability = 0;
  let drawProbability = 0;
  // iterate over all outcomes and calculate winner, probability of it happening
  for (const arrangement of arrangements) {
    const harrisVotes =
      safeHarrisVotes +
      swingStates.reduce((sum, state) => sum + (arrangement[state] === "D" ? electoralVotes[state as State] : 0), 0);
    const trumpVotes =
      safeTrumpVotes +
      swingStates.reduce((sum, state) => sum + (arrangement[state] === "R" ? electoralVotes[state as State] : 0), 0);

    // Calculate the probability of this arrangement
    let arrangementProbability = 1;
    for (const state of swingStates) {
      const prob = stateProbabilities[state as State]!;
      const party = arrangement[state];
      const partyProbability = (prob.leftCandidateParty === party ? prob.leftCandidate : 0)
        + (prob.rightCandidateParty === party ? prob.rightCandidate : 0);
      arrangementProbability *= partyProbability;
    }
    if (harrisVotes >= 270) {
      harrisProbability += arrangementProbability;
    } else if (trumpVotes >= 270) {
      trumpProbability += arrangementProbability;
    } else {
      drawProbability += arrangementProbability;
    }
  }

  return {
    R: trumpProbability,
    D: harrisProbability,
    draw: drawProbability,
  };
};

/** Direct convolution for the Poisson-binomial seat-count distribution. */
export const calculateSenateProbability = (
  stateProbabilities: Partial<Record<State, StateProbability | null>>,
): FinalProbability | null => {
  const races = Object.keys(senate2026Incumbents) as State[];
  if (races.some((state) => !stateProbabilities[state])) return null;

  // The current Senate has 53 Republican and 47 Democratic caucus seats;
  // Incumbent seats are removed from the baseline, including special seats.
  const fixedRepublicanSeats = 53 - races.filter((state) => senate2026Incumbents[state] === "R").length;
  // The 47 non-Republican caucus seats include two Independents. Remove all
  // non-Republican incumbents up for election so only D wins add D seats.
  const fixedDemocraticSeats = 47 - races.filter((state) => senate2026Incumbents[state] !== "R").length;
  let pdfR = [1];
  let pdfD = [1];
  let pdfI = [1];
  for (const state of races) {
    const probability = stateProbabilities[state]!;
    const republicanWin = (probability.leftCandidateParty === "R" ? probability.leftCandidate : 0)
      + (probability.rightCandidateParty === "R" ? probability.rightCandidate : 0);
    const democraticWin = (probability.leftCandidateParty === "D" ? probability.leftCandidate : 0)
      + (probability.rightCandidateParty === "D" ? probability.rightCandidate : 0);
    const independentWin = (probability.leftCandidateParty === "I" ? probability.leftCandidate : 0)
      + (probability.rightCandidateParty === "I" ? probability.rightCandidate : 0);
    const nextR = Array(pdfR.length + 1).fill(0) as number[];
    const nextD = Array(pdfD.length + 1).fill(0) as number[];
    const nextI = Array(pdfI.length + 1).fill(0) as number[];
    for (let seats = 0; seats < pdfR.length; seats++) {
      nextR[seats] += pdfR[seats] * (1 - republicanWin);
      nextR[seats + 1] += pdfR[seats] * republicanWin;
    }
    for (let seats = 0; seats < pdfD.length; seats++) {
      nextD[seats] += pdfD[seats] * (1 - democraticWin);
      nextD[seats + 1] += pdfD[seats] * democraticWin;
    }
    for (let seats = 0; seats < pdfI.length; seats++) {
      nextI[seats] += pdfI[seats] * (1 - independentWin);
      nextI[seats + 1] += pdfI[seats] * independentWin;
    }
    pdfR = nextR;
    pdfD = nextD;
    pdfI = nextI;
  }

  // Build the CDF from the convolution PDF for majority threshold queries.
  const cdfR = Array(pdfR.length).fill(0) as number[];
  const cdfD = Array(pdfD.length).fill(0) as number[];
  const cdfI = Array(pdfI.length).fill(0) as number[];
  for (let wins = 0; wins < pdfR.length; wins++) cdfR[wins] = pdfR[wins] + (wins > 0 ? cdfR[wins - 1] : 0);
  for (let wins = 0; wins < pdfD.length; wins++) cdfD[wins] = pdfD[wins] + (wins > 0 ? cdfD[wins - 1] : 0);
  for (let wins = 0; wins < pdfI.length; wins++) cdfI[wins] = pdfI[wins] + (wins > 0 ? cdfI[wins - 1] : 0);

  const minimumRepublicanWins = 50 - fixedRepublicanSeats;
  const minimumDemocraticWins = 51 - fixedDemocraticSeats;
  const republicanVictory = 1 - (minimumRepublicanWins > 0 ? cdfR[minimumRepublicanWins - 1] : 0);
  const democraticVictory = 1 - (minimumDemocraticWins > 0 ? cdfD[minimumDemocraticWins - 1] : 0);

  return { R: republicanVictory, D: democraticVictory, draw: 0 };
};
