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
  let pdf = [1];
  let partyPdf: number[][] = [[1]];
  for (const state of races) {
    const probability = stateProbabilities[state]!;
    const republicanWin = (probability.leftCandidateParty === "R" ? probability.leftCandidate : 0)
      + (probability.rightCandidateParty === "R" ? probability.rightCandidate : 0);
    const next = Array(pdf.length + 1).fill(0) as number[];
    for (let seats = 0; seats < pdf.length; seats++) {
      next[seats] += pdf[seats] * (1 - republicanWin);
      next[seats + 1] += pdf[seats] * republicanWin;
    }
    pdf = next;

    const leftWin = probability.leftCandidate;
    const rightWin = probability.rightCandidate;
    const leftDemSeats = probability.leftCandidateParty === "D" ? 1 : 0;
    const rightDemSeats = probability.rightCandidateParty === "D" ? 1 : 0;
    const leftRepSeats = probability.leftCandidateParty === "R" ? 1 : 0;
    const rightRepSeats = probability.rightCandidateParty === "R" ? 1 : 0;
    const nextPartyPdf = Array.from(
      { length: partyPdf.length + Math.max(leftDemSeats, rightDemSeats) },
      () => Array(partyPdf[0].length + Math.max(leftRepSeats, rightRepSeats)).fill(0) as number[],
    );
    for (let demSeats = 0; demSeats < partyPdf.length; demSeats++) {
      for (let repSeats = 0; repSeats < partyPdf[demSeats].length; repSeats++) {
        const mass = partyPdf[demSeats][repSeats];
        nextPartyPdf[demSeats + leftDemSeats][repSeats + leftRepSeats] += mass * leftWin;
        nextPartyPdf[demSeats + rightDemSeats][repSeats + rightRepSeats] += mass * rightWin;
      }
    }
    partyPdf = nextPartyPdf;
  }

  // Build the CDF from the convolution PDF for majority threshold queries.
  const cdf = Array(pdf.length).fill(0) as number[];
  for (let wins = 0; wins < pdf.length; wins++) cdf[wins] = pdf[wins] + (wins > 0 ? cdf[wins - 1] : 0);

  const minimumRepublicanWins = 50 - fixedRepublicanSeats;
  const republicanVictory = 1 - (minimumRepublicanWins > 0 ? cdf[minimumRepublicanWins - 1] : 0);
  const democraticVictory = partyPdf.reduce((total, row, democraticWins) =>
    democraticWins + fixedDemocraticSeats >= 51
      ? total + row.reduce((rowTotal, mass) => rowTotal + mass, 0)
      : total,
  0);
  return { R: republicanVictory, D: democraticVictory, draw: 0 };
};
