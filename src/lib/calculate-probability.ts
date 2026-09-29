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
    if (prob.R !== 1 && prob.D !== 1) {
      swingStates.push(state);
    } else if (prob.R === 1) {
      safeTrumpVotes += electoralVotes[state as State];
    } else if (prob.D === 1) {
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
      arrangementProbability *= arrangement[state] === "D" ? prob.D : prob.R;
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
  let pdf = [1];
  for (const state of races) {
    const republicanWin = stateProbabilities[state]!.R;
    const next = Array(pdf.length + 1).fill(0) as number[];
    for (let seats = 0; seats < pdf.length; seats++) {
      next[seats] += pdf[seats] * (1 - republicanWin);
      next[seats + 1] += pdf[seats] * republicanWin;
    }
    pdf = next;
  }

  // Build the CDF from the convolution PDF for majority threshold queries.
  const cdf = Array(pdf.length).fill(0) as number[];
  for (let wins = 0; wins < pdf.length; wins++) cdf[wins] = pdf[wins] + (wins > 0 ? cdf[wins - 1] : 0);

  const minimumRepublicanWins = 50 - fixedRepublicanSeats;
  const republicanVictory = 1 - (minimumRepublicanWins > 0 ? cdf[minimumRepublicanWins - 1] : 0);
  const maximumRepublicanWinsForDemocraticVictory = 49 - fixedRepublicanSeats;
  const democraticVictory = maximumRepublicanWinsForDemocraticVictory < 0
    ? 0
    : cdf[Math.min(pdf.length - 1, maximumRepublicanWinsForDemocraticVictory)];
  return { R: republicanVictory, D: democraticVictory, draw: 0 };
};
