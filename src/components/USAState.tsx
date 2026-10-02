import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import ProbabilitySlider from "./ProbabilitySlider";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";
import { Button } from "./ui/button";
import { stateData } from "@/data/static-state-data";
import { type StateProbability } from "@/data/state-probabilities";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { senatePartyColors, type SenateRace } from "@/data/senate-2026";

interface BasicUSAStateProps {
  stateName: string;
  dimensions: string;
  state: string;
  fill: string;
  onSelectState: () => void;
  isElection: boolean;
  isOpen: boolean;
  election: "presidential" | "senate";
}

interface USAStateProps extends BasicUSAStateProps {
  onSelectState: () => void;
  onUnselectState: () => void;
  onClearSelection: () => void;
  probability: StateProbability | null;
  setProbability: (prob: StateProbability | null) => void;
  senateRace?: SenateRace;
}

const USAState = ({
  stateName,
  dimensions,
  state,
  fill,
  onSelectState,
  onUnselectState,
  onClearSelection,
  probability,
  setProbability,
  isElection,
  isOpen,
  election,
  senateRace,
}: USAStateProps) => {
  // The slider value always represents the probability of the right-side candidate winning.
  const rightCandidateProbability = probability?.rightCandidate ?? 0.5;
  const initialSliderValue = rightCandidateProbability * 100;
  const [sliderValue, setSliderValue] = useState([initialSliderValue]);

  useEffect(() => {
    if (!isOpen) {
      setSliderValue([(probability?.rightCandidate ?? 0.5) * 100]);
    }
  }, [isOpen, probability, senateRace?.rightCandidateParty]);

  const numElectoralVotes = stateData[state]?.electoralVotes ?? 0;
  const incumbentColor = senateRace?.incumbent === "R"
    ? "text-red-600"
    : senateRace?.incumbent === "D"
      ? "text-blue-600"
      : "text-purple-700";

  const onOpenChange = (open: boolean) => {
    if (open) onSelectState();
    else onUnselectState();
  };

  const onClickCancel = () => {
    onUnselectState();
  };

  const onSave = () => {
    const rightCandidateWin = sliderValue[0] / 100;
    const leftCandidateWin = 1 - rightCandidateWin;
    setProbability({
      leftCandidate: leftCandidateWin,
      rightCandidate: rightCandidateWin,
      leftCandidateParty: election === "senate" ? senateRace!.leftCandidateParty : "D",
      rightCandidateParty: election === "senate" ? senateRace!.rightCandidateParty : "R",
    });
    onUnselectState();
  };

  return (
    isElection ?
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <path
          d={dimensions}
          fill={fill}
          data-name={state}
          className={cn("hover:cursor-pointer", "hover:opacity-75")}
          // onClick={onSelectState}
        >
          <title>{stateName}</title>
        </path>
      </PopoverTrigger>
      <PopoverContent side="top" className="md:w-md max-sm:w-[min(20rem,calc(100vw-2rem))] max-sm:max-w-[calc(100vw-2rem)]" updatePositionStrategy="always">
        <div className="flex flex-col px-4 w-full space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{stateName}</h3>
          {election === "senate" ? (
            <p className="text-sm text-muted-foreground">
              Incumbent: {senateRace?.incumbentName ? (
                <span className={`font-medium ${incumbentColor}`}>
                  {senateRace.incumbentName}{senateRace.incumbent ? ` (${senateRace.incumbent})` : ""}
                </span>
              ) : (
                <span>Vacant{senateRace?.formerIncumbentName ? ` (formerly held by ${senateRace.formerIncumbentName})` : ""}</span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">{numElectoralVotes} electoral votes</p>
          )}
          </div>
          <ProbabilitySlider
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
            election={election}
            leftCandidate={senateRace?.leftCandidate ?? "Harris"}
            leftCandidateParty={senateRace?.leftCandidateParty ?? "D"}
            rightCandidate={senateRace?.rightCandidate ?? "Trump"}
            rightCandidateParty={senateRace?.rightCandidateParty ?? "R"}
            partyColors={senatePartyColors}
          />
          <div className="flex ml-auto space-x-2">
            <Button type="button" variant="outline" onClick={onClickCancel} className="hover:cursor-pointer">
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              className="bg-purple-700 hover:bg-purple-500 hover:cursor-pointer"
              onClick={onSave}
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    : <path d={dimensions} fill={fill} data-name={state} className="cursor-default" onClick={onClearSelection}>
        <title>{stateName} — no Senate election in 2026</title>
      </path>
  );

  // return (
  //   <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
  //     <DialogTrigger asChild>
  //       <path
  //         d={dimensions}
  //         fill={fill}
  //         data-name={state}
  //         className={cn("hover:cursor-pointer", "hover:opacity-75")}
  //         // onClick={onSelectState}
  //       >
  //         <title>{stateName}</title>
  //       </path>
  //     </DialogTrigger>
  //     <DialogContent className="w-md">
  //       <DialogHeader className="flex flex-col items-center">
  //         <DialogTitle>{stateName}</DialogTitle>
  //         <DialogDescription>{numElectoralVotes} electoral votes</DialogDescription>
  //       </DialogHeader>
  //       <ProbabilitySlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
  //       <DialogFooter>
  //         <Button type="button" variant="outline" onClick={onClickCancel} className="hover:cursor-pointer">
  //           Cancel
  //         </Button>
  //         <Button
  //           type="button"
  //           variant="default"
  //           className="bg-purple-700 hover:bg-purple-500 hover:cursor-pointer"
  //           onClick={onSave}
  //         >
  //           Confirm
  //         </Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );
};

export default USAState;
