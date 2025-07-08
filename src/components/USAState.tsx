import { cn } from "../lib/utils";
import { useState } from "react";
import ProbabilitySlider from "./ProbabilitySlider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { stateData } from "@/data/static-state-data";
import { type StateProbability } from "@/data/state-probabilities";

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
    setDialogOpen(open);
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
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <path
          d={dimensions}
          fill={fill}
          data-name={state}
          className={cn("hover:cursor-pointer", "hover:opacity-75")}
          // onClick={onSelectState}
        >
          <title>{stateName}</title>
        </path>
      </DialogTrigger>
      <DialogContent className="w-md">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>{stateName}</DialogTitle>
          <DialogDescription>{numElectoralVotes} electoral votes</DialogDescription>
        </DialogHeader>
        <ProbabilitySlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default USAState;
