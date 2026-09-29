import { useEffect, useRef, useState } from "react";
import USAState from "./USAState";
import { stateData, type State } from "../data/static-state-data";
import type { StateProbabilities, StateProbability } from "@/data/state-probabilities";

// Long enough for the zoom-out to be visible, short of the full 500ms transform.
const ZOOM_OUT_BEFORE_NEXT_MS = 200;
const POPOVER_AFTER_ZOOM_MS = 100;

export type CustomizeConfig = {
  fill?: string;
  clickHandler?: () => void;
};

const dataStates = stateData;

interface USAMapProps {
  onClick: (stateAbbreviation: State) => void;
  width?: number;
  height?: number;
  title?: string;
  defaultFill?: string;
  customize?: Partial<Record<State, CustomizeConfig>>;
  stateProbabilities: StateProbabilities;
  setStateProbability: (state: State, prob: StateProbability | null) => void;
  electionStates: Set<string>;
  election: "presidential" | "senate";
}

const USAMap = ({
  onClick,
  width = 959,
  height = 593,
  title = "Blank US states map",
  defaultFill = "#D3D3D3",
  customize = {},
  stateProbabilities,
  setStateProbability,
  electionStates,
  election,
}: USAMapProps) => {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [openState, setOpenState] = useState<State | null>(null);
  const groupRef = useRef<SVGGElement>(null);
  const selectedRef = useRef<State | null>(null);
  const intendedRef = useRef<State | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const fillStateColor = (state: State) => {
    return customize[state]?.fill || defaultFill;
  };

  const schedule = (delay: number, action: () => void) => {
    const id = window.setTimeout(action, delay);
    timersRef.current.push(id);
  };

  const zoomTo = (state: State) => {
    selectedRef.current = state;
    setSelectedState(state);
    schedule(POPOVER_AFTER_ZOOM_MS, () => {
      if (intendedRef.current === state) setOpenState(state);
    });
  };

  const handleStateClick = (state: State) => {
    clearTimers();
    onClick(state);
    const previous = selectedRef.current;
    intendedRef.current = state;

    if (previous && previous !== state) {
      selectedRef.current = null;
      setOpenState(null);
      setSelectedState(null);
      schedule(ZOOM_OUT_BEFORE_NEXT_MS, () => {
        if (intendedRef.current === state) zoomTo(state);
      });
      return;
    }

    zoomTo(state);
  };

  const dismiss = (state?: State) => {
    if (state && intendedRef.current && intendedRef.current !== state) return;
    clearTimers();
    intendedRef.current = null;
    selectedRef.current = null;
    setOpenState(null);
    setSelectedState(null);
  };

  // Calculate transform for zoom
  let transform = "";
  if (selectedState && groupRef.current) {
    const statePath = groupRef.current.querySelector(`[data-name="${selectedState}"]`);
    if (statePath) {
      const bbox = (statePath as SVGGraphicsElement).getBBox();
      const scale = 2; // adjust zoom level
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const translateX = width / 2 - cx * scale;
      const translateY = height / 2 - cy * scale;
      transform = `translate(${translateX}, ${translateY}) scale(${scale})`;
    }
  }

  const setProbabilityByState = (state: State) => (prob: StateProbability | null) => {
    setStateProbability(state, prob);
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 959 593" onClick={() => dismiss()}>
      <title>{title}</title>
      <g
        className="transition-transform duration-500 ease-in-out outlines"
        ref={groupRef}
        transform={transform}
        onClick={(e) => e.stopPropagation()} // prevent zoom reset when clicking a state
      >
        {Object.entries(dataStates).map(([stateKey, data]) => (
          <USAState
            key={stateKey}
            stateName={data.name ?? ""}
            dimensions={data.dimensions ?? ""}
            state={stateKey as State}
            fill={fillStateColor(stateKey as State)}
            isElection={electionStates.has(stateKey)}
            isOpen={openState === stateKey}
            election={election}
            onSelectState={() => handleStateClick(stateKey as State)}
            onUnselectState={() => dismiss(stateKey as State)}
            onClearSelection={() => dismiss()}
            probability={stateProbabilities[stateKey as State]}
            setProbability={setProbabilityByState(stateKey as State)}
          />
        ))}
      </g>
    </svg>
  );
};

export default USAMap;
