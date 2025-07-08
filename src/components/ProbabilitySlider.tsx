"use client";

import * as Slider from "@radix-ui/react-slider";

interface ProbabilitySliderProps {
  sliderValue: number[];
  setSliderValue: (value: number[]) => void;
}

export default function ProbabilitySlider({ sliderValue: value, setSliderValue: setValue }: ProbabilitySliderProps) {
  const harrisPercent = value[0];
  const trumpPercent = 100 - harrisPercent;

  const getThumbColor = () => {
    const red = Math.round(trumpPercent * 2.55);
    const blue = Math.round(harrisPercent * 2.55);
    return `rgb(${red}, 0, ${blue})`;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-full h-8">
        {/* Gradient Track Background */}
        <div
          className="absolute w-full rounded-full pointer-events-none inset-y-1"
          style={{ background: "linear-gradient(to right, red, blue)" }}
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
            style={{ backgroundColor: getThumbColor() }}
            aria-label="Probability"
          />
        </Slider.Root>
      </div>
      <div className="flex justify-between w-full text-sm">
        <span className="text-red-600">Trump: {trumpPercent}%</span>
        <span className="text-blue-600">Harris: {harrisPercent}%</span>
      </div>
    </div>
  );
}
