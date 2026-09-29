import { useMemo, useState } from "react";
import { initialStateProbabilities, type StateProbabilities, type StateProbability } from "../data/state-probabilities";
import { initialSenateProbabilities, senate2026Incumbents } from "../data/senate-2026";
import USAMap, { type CustomizeConfig } from "./USAMap";
import { type State } from "../data/static-state-data";
import { getColorFromProbability } from "@/lib/get-color-from-prob";
import { calculateProbability, calculateSenateProbability } from "@/lib/calculate-probability";
import VictoryProbabilities from "./FinalProbabilities";
import VictoryProbabilitiesPlaceholder from "./FinalProbabilitiesPlaceholder";

const fillFromProbability = (prob: StateProbability | null): string => {
  if (!prob) {
    return "gray";
  } else {
    return getColorFromProbability(prob);
  }
};

export default function Predictor({ election }: { election: "presidential" | "senate" }) {
  const [presidentialProbabilities, setPresidentialProbabilities] = useState<StateProbabilities>(initialStateProbabilities);
  const [senateProbabilities, setSenateProbabilities] = useState<StateProbabilities>(() => {
    const entries = Object.fromEntries(Object.keys(senate2026Incumbents).map((state) => [state, initialSenateProbabilities[state as State]]));
    return Object.fromEntries(Object.keys(initialStateProbabilities).map((state) => [state, entries[state] ?? null])) as StateProbabilities;
  });
  const stateProbabilities = election === "senate" ? senateProbabilities : presidentialProbabilities;
  const updateProbabilities = election === "senate" ? setSenateProbabilities : setPresidentialProbabilities;
  const states = Object.keys(stateProbabilities) as State[];

  const probability = election === "senate" ? calculateSenateProbability(senateProbabilities) : calculateProbability(presidentialProbabilities);
  const electionStates = election === "senate" ? new Set(Object.keys(senate2026Incumbents)) : new Set(states);

  const statesFilling = (): Record<string, CustomizeConfig> => {
    const result: Record<string, CustomizeConfig> = {};

    for (const state of states) {
      result[state] = {
        fill: electionStates.has(state) ? fillFromProbability(stateProbabilities[state]) : "#d1d5db",
      };
    }
    return result;
  };

  const customizeStates = useMemo(statesFilling, [stateProbabilities, states]);

  const setStateProbability = (state: State, prob: StateProbability | null) => {
    updateProbabilities((prev) => ({
      ...prev,
      [state]: prob,
    }));
  };

  return (
    <>
      <section className="w-full max-w-3xl px-4 text-center space-y-1" aria-labelledby="election-title">
        <h1 id="election-title" className="text-2xl font-bold text-gray-900">
          {election === "senate" ? "2026 Senate election predictions" : "2024 presidential election predictions"}
        </h1>
        {election === "senate" && (
        <p className="text-sm text-muted-foreground">
             Select a state below and use its slider to estimate the probability for each candidate in the state's Senate race.<br/>
             These will be used to calculate the probability of either party winning a majority in the Senate.<br/>
             Grayed out states have no Senate race in 2026.
        </p>
        )}
      </section>
      {probability ? <VictoryProbabilities prob={probability} election={election} /> : <VictoryProbabilitiesPlaceholder election={election} />}
      <USAMap
        customize={customizeStates}
        onClick={() => {}}
        stateProbabilities={stateProbabilities}
        setStateProbability={setStateProbability}
        electionStates={electionStates}
        election={election}
      />
    </>
  );
}
