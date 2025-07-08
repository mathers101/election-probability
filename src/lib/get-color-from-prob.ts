import type { StateProbability } from "../data/state-probabilities";

export const getColorFromProbability = (prob: StateProbability) => {
  const red = Math.round(prob.R * 255);
  const blue = Math.round(prob.D * 255);
  return `rgb(${red}, 0, ${blue})`;
};
