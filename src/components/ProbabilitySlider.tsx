"use client";

import { getColorFromProbability } from "@/lib/get-color-from-prob";
import * as Slider from "@radix-ui/react-slider";

interface ProbabilitySliderProps {
  sliderValue: number[];
  setSliderValue: (value: number[]) => void;
}

export default function ProbabilitySlider({ sliderValue: value, setSliderValue: setValue }: ProbabilitySliderProps) {
  const trumpPercent = value[0];
  const harrisPercent = 100 - trumpPercent;
  const prob = { R: trumpPercent / 100, D: harrisPercent / 100 };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-full h-8">
        {/* Gradient Track Background */}
        <div
          className="absolute w-full rounded-full pointer-events-none inset-y-1"
          style={{ background: "linear-gradient(to right, blue, red)" }}
        />
        <Slider.Root
          className="relative flex items-center w-full h-8 select-none touch-none"
          min={0}
          max={100}
          step={1}
          value={value}
          onValueChange={setValue}
        >
          <Slider.Track className="relative w-full h-2 bg-transparent rounded-full">
            <Slider.Range className="absolute h-2 bg-transparent rounded-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 transition-colors border border-white rounded-full shadow cursor-pointer"
            style={{ backgroundColor: getColorFromProbability(prob) }}
            aria-label="Probability"
          />
        </Slider.Root>
      </div>
      <div className="flex justify-between w-full text-sm">
        <span className="text-blue-600">Harris: {harrisPercent}%</span>
        <span className="text-red-600">Trump: {trumpPercent}%</span>
      </div>
    </div>
  );
}
