import { useMemo, useState } from "react";
import { initialStateProbabilities, type StateProbabilities, type StateProbability } from "../data/state-data";
import USAMap, { type CustomizeConfig } from "./USAMap";
import { type State } from "../data/map-dimensions";

const fillFromProbability = (prob: StateProbability | null): string => {
  if (!prob) {
    return "gray";
  } else if (prob.R >= 0.7) {
    return "red";
  } else if (prob.D >= 0.3) {
    return "blue";
  } else {
    return "yellow";
  }
};

export default function Predictor() {
  const [stateProbabilities, setStateProbabilities] = useState<StateProbabilities>(initialStateProbabilities);
  const states = Object.keys(stateProbabilities) as State[];
  // const mapHandler = (state: State) => {
  //   // alert(state);
  //   return;
  // };

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

  const setStateProbability = (state: State, prob: StateProbability) => {
    setStateProbabilities((prev) => ({
      ...prev,
      [state]: prob,
    }));
  };

  return (
    <>
      <USAMap
        customize={customizeStates}
        onClick={() => {}}
        stateProbabilities={stateProbabilities}
        setStateProbability={setStateProbability}
      />
    </>
  );
}
