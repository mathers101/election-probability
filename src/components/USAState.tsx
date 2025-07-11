import { cn } from "../lib/utils";
import { useState } from "react";
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

interface BasicUSAStateProps {
  stateName: string;
  dimensions: string;
  state: string;
  fill: string;
  onSelectState: () => void;
}

interface USAStateProps extends BasicUSAStateProps {
  onSelectState: () => void;
  onUnselectState: () => void;
  probability: StateProbability | null;
  setProbability: (prob: StateProbability | null) => void;
}

const USAState = ({
  stateName,
  dimensions,
  state,
  fill,
  onSelectState,
  onUnselectState,
  probability,
  setProbability,
}: USAStateProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // slider value is the probability of a Trump win
  const initialSliderValue = (probability?.R ?? 0.5) * 100;
  const [sliderValue, setSliderValue] = useState([initialSliderValue]);

  const numElectoralVotes = stateData[state]?.electoralVotes ?? 0;

  const onOpenChange = (open: boolean) => {
    onSelectState();
    if (open) {
      setTimeout(() => setDialogOpen(open), 100);
      // setDialogOpen(open);
    } else {
      setDialogOpen(open);
    }
    if (!open) {
      onUnselectState();
      setSliderValue([initialSliderValue]);
    }
  };

  const onClickCancel = () => {
    setDialogOpen(false);
    setSliderValue([initialSliderValue]);
    onUnselectState();
  };

  const onSave = () => {
    // slider value is the probability of a Trump win
    setProbability({ R: sliderValue[0] / 100, D: (100 - sliderValue[0]) / 100 });
    setDialogOpen(false);
    onUnselectState();
  };

  return (
    <Popover open={dialogOpen} onOpenChange={onOpenChange}>
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
      <PopoverContent side="top" className="w-md">
        <div className="flex flex-col px-4 w-full space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{stateName}</h3>
            <p className="text-sm text-muted-foreground">{numElectoralVotes} electoral votes</p>
          </div>
          <ProbabilitySlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
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
