import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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

interface USAStateProps {
  stateName: string;
  dimensions: string;
  state: string;
  fill: string;
  onSelectState: () => void;
  onUnselectState: () => void;
  probability: { R: number; D: number } | null;
  setProbability: (prob: { R: number; D: number }) => void;
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
  const [sliderValue, setSliderValue] = useState([(probability?.D ?? 0.5) * 100]);

  const onOpenChange = (open: boolean) => {
    onSelectState();
    setDialogOpen(open);
    if (!open) {
      onUnselectState();
    }
  };

  const onClickCancel = () => {
    setDialogOpen(false);
    onUnselectState();
  };

  const onSave = () => {
    setProbability({ R: (100 - sliderValue[0]) / 100, D: sliderValue[0] / 100 });
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
          onClick={onSelectState}
        >
          <title>{stateName}</title>
        </path>
      </DialogTrigger>
      <DialogContent className="w-md">
        <DialogHeader>
          <DialogTitle className="mx-auto mb-2">{stateName}</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>hi</DialogDescription>
          </VisuallyHidden>
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
