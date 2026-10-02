import { useEffect, useMemo, useRef, useState } from "react";
import { initialStateProbabilities, type StateProbabilities, type StateProbability } from "../data/state-probabilities";
import { initialSenateProbabilities, senate2026Incumbents, senate2026Races } from "../data/senate-2026";
import USAMap, { type CustomizeConfig } from "./USAMap";
import { type State } from "../data/static-state-data";
import { getColorFromProbability } from "@/lib/get-color-from-prob";
import { calculateProbability, calculateSenateProbability, calculateSenateSeatPdfs } from "@/lib/calculate-probability";
import SenateSeatDistribution from "./SenateSeatDistribution";
import VictoryProbabilities from "./FinalProbabilities";
import VictoryProbabilitiesPlaceholder from "./FinalProbabilitiesPlaceholder";
import { Slider } from "./ui/slider";

const fillFromProbability = (prob: StateProbability | null): string => {
  if (!prob) {
    return "gray";
  } else {
    return getColorFromProbability(prob);
  }
};

const senateStateProbabilities = (safeRaceProbability: number): StateProbabilities => {
  const defaults = initialSenateProbabilities(safeRaceProbability);
  const entries = Object.fromEntries(Object.keys(senate2026Incumbents).map((state) => [state, defaults[state as State]]));
  return Object.fromEntries(Object.keys(initialStateProbabilities).map((state) => [state, entries[state] ?? null])) as StateProbabilities;
};

const sameProbability = (left: StateProbability | null, right: StateProbability | null) =>
  !!left && !!right
  && left.leftCandidate === right.leftCandidate
  && left.rightCandidate === right.rightCandidate;

export default function Predictor({ election }: { election: "presidential" | "senate" }) {
  const [safeRaceProbability, setSafeRaceProbability] = useState(0.95);
  const [showSafeRaceControl, setShowSafeRaceControl] = useState(false);
  const senateRaces = useMemo(
    () => senate2026Races(safeRaceProbability),
    [safeRaceProbability],
  );
  const [presidentialProbabilities, setPresidentialProbabilities] = useState<StateProbabilities>(initialStateProbabilities);
  const [senateProbabilities, setSenateProbabilities] = useState<StateProbabilities>(() => senateStateProbabilities(0.95));
  const previousSafeRaceProbability = useRef(safeRaceProbability);

  useEffect(() => {
    const previous = previousSafeRaceProbability.current;
    if (previous === safeRaceProbability) return;
    const previousDefaults = senateStateProbabilities(previous);
    previousSafeRaceProbability.current = safeRaceProbability;
    setSenateProbabilities((current) => {
      const nextDefaults = senateStateProbabilities(safeRaceProbability);
      const next = { ...current };
      for (const state of Object.keys(nextDefaults) as State[]) {
        if (sameProbability(current[state], previousDefaults[state])) {
          next[state] = nextDefaults[state];
        }
      }
      return next;
    });
  }, [safeRaceProbability]);
  const stateProbabilities = election === "senate" ? senateProbabilities : presidentialProbabilities;
  const updateProbabilities = election === "senate" ? setSenateProbabilities : setPresidentialProbabilities;
  const states = Object.keys(stateProbabilities) as State[];

  const probability = election === "senate" ? calculateSenateProbability(senateProbabilities) : calculateProbability(presidentialProbabilities);
  const senateSeatPdfs = election === "senate" ? calculateSenateSeatPdfs(senateProbabilities) : null;
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
      <section className="w-full max-w-3xl px-4 text-center space-y-3" aria-labelledby="election-title">
        <h1 id="election-title" className="text-2xl font-bold text-gray-900">
          {election === "senate" ? "2026 Senate election predictions" : "2024 presidential election predictions"}
        </h1>
        {election === "senate" && (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Select a state below and use its slider to estimate the probability for each candidate in the state's Senate race.</p>
          <p>These will be used to calculate the probability of either party winning a majority in the Senate.</p>
          <p>Grayed out states have no Senate race in 2026.</p>
          <p>
            Races which are rated by forecasters as safe for the incumbent party are given a default percentage of {Math.round(safeRaceProbability * 100)}%.<br/>
             Click{" "}
            <button
              type="button"
              className="underline cursor-pointer hover:text-gray-900"
              onClick={() => setShowSafeRaceControl((open) => !open)}
            >
              here
            </button>
            {showSafeRaceControl ? " to hide this control." : " to modify this value."}
          </p>
          {showSafeRaceControl && (
            <div className="mx-auto w-full max-w-md space-y-2 pt-1 text-left text-gray-900">
              <div className="flex items-center justify-between gap-3 text-sm">
                <label htmlFor="safe-seat-probability">Safe seat probability</label>
                <span className="ml-auto">{Math.round(safeRaceProbability * 100)}%</span>
                {/* <button
                  type="button"
                  className="underline cursor-pointer text-muted-foreground hover:text-gray-900"
                  onClick={() => setShowSafeRaceControl(false)}
                >
                  Hide
                </button> */}
              </div>
              <Slider
                id="safe-seat-probability"
                min={50}
                max={100}
                step={1}
                value={[Math.round(safeRaceProbability * 100)]}
                onValueChange={([percent]) => setSafeRaceProbability(percent / 100)}
                aria-label="Safe race probability"
              />
            </div>
          )}
        </div>
        )}
      </section>
      {(election === "presidential" && !probability) &&<VictoryProbabilitiesPlaceholder election={election} />}
      <USAMap
        customize={customizeStates}
        onClick={() => {}}
        stateProbabilities={stateProbabilities}
        setStateProbability={setStateProbability}
        electionStates={electionStates}
        election={election}
        senateRaces={senateRaces}
      />
       {election === "senate" && probability && <VictoryProbabilities prob={probability} election={election} />}
       {election === "senate" && senateSeatPdfs && <SenateSeatDistribution pdfs={senateSeatPdfs} />}
    </>
  );
}
