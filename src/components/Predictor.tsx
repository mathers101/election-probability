import { useMemo, useState } from "react";
import { initialStateProbabilities, type StateProbabilities, type StateProbability } from "../data/state-probabilities";
import USAMap, { type CustomizeConfig } from "./USAMap";
import { type State } from "../data/static-state-data";
import { getColorFromProbability } from "@/lib/get-color-from-prob";
import { calculateProbability } from "@/lib/calculate-probability";
import VictoryProbabilities from "./FinalProbabilities";
import VictoryProbabilitiesPlaceholder from "./FinalProbabilitiesPlaceholder";

const fillFromProbability = (prob: StateProbability | null): string => {
  if (!prob) {
    return "gray";
  } else {
    return getColorFromProbability(prob);
  }
};

export default function Predictor() {
  const [stateProbabilities, setStateProbabilities] = useState<StateProbabilities>(initialStateProbabilities);
  const states = Object.keys(stateProbabilities) as State[];

  const probability = calculateProbability(stateProbabilities);

  const statesFilling = (): Record<string, CustomizeConfig> => {
    const result: Record<string, CustomizeConfig> = {};

    for (const state of states) {
      result[state] = {
        fill: fillFromProbability(stateProbabilities[state]),
      };
    }
    return result;
  };

  const customizeStates = useMemo(statesFilling, [stateProbabilities, states]);

  const setStateProbability = (state: State, prob: StateProbability | null) => {
    setStateProbabilities((prev) => ({
      ...prev,
      [state]: prob,
    }));
  };

  return (
    <>
      {probability ? <VictoryProbabilities prob={probability} /> : <VictoryProbabilitiesPlaceholder />}
      <USAMap
        customize={customizeStates}
        onClick={() => {}}
        stateProbabilities={stateProbabilities}
        setStateProbability={setStateProbability}
      />
    </>
  );
}
