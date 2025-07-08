import { useRef, useState } from "react";
import USAState from "./USAState";
import { stateDimensions, type State } from "../data/map-dimensions";
import type { StateProbabilities, StateProbability } from "@/data/state-data";

export type CustomizeConfig = {
  fill?: string;
  clickHandler?: () => void;
};

const dataStates = stateDimensions;

interface USAMapProps {
  onClick: (stateAbbreviation: State) => void;
  width?: number;
  height?: number;
  title?: string;
  defaultFill?: string;
  customize?: Partial<Record<State, CustomizeConfig>>;
  stateProbabilities: StateProbabilities;
  setStateProbability: (state: State, prob: { R: number; D: number }) => void;
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
}: USAMapProps) => {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const groupRef = useRef<SVGGElement>(null);

  const fillStateColor = (state: State) => {
    return customize[state]?.fill || defaultFill;
  };

  const handleStateClick = (state: State) => {
    setSelectedState(state);
    onClick(state);
  };

  const resetZoom = () => setSelectedState(null);

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

  const setProbabilityByState = (state: State) => (prob: StateProbability) => {
    setStateProbability(state, prob);
  };

  return (
    <svg
      className=""
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 959 593"
      onClick={resetZoom}
    >
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
            onSelectState={() => handleStateClick(stateKey as State)}
            onUnselectState={resetZoom}
            probability={stateProbabilities[stateKey as State]}
            setProbability={setProbabilityByState(stateKey as State)}
          />
        ))}
      </g>
    </svg>
  );
};

export default USAMap;
