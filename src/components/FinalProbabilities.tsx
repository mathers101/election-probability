import type { FinalProbability } from "@/lib/calculate-probability";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { HelpCircle } from "lucide-react";

interface ProbabilitiesProps {
  prob: FinalProbability;
}

export default function VictoryProbabilities({ prob }: ProbabilitiesProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-8 w-full max-w-3xl mx-auto mt-4 px-4">
      <Card className="flex-1 border-blue-500">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">Probability of</p>
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">Harris Victory</p>
          <p className="text-3xl font-bold mt-1">{(prob.D * 100).toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Card className="flex-1 border-gray-400">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">Probability of</p>
          <div className="flex items-center gap-1">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Draw</p>
            <Popover>
              <PopoverTrigger asChild>
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 translate-y-[3px] cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent side="right" className="max-w-xs text-sm">
                A draw occurs if both candidates receive exactly 269 electoral votes each. In this case, the election is
                decided by the House of Representatives.
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-3xl font-bold mt-1">{(prob.draw * 100).toFixed(2)}%</p>
        </CardContent>
      </Card>
      <Card className="flex-1 border-red-500">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">Probability of</p>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">Trump Victory</p>
          <p className="text-3xl font-bold mt-1">{(prob.R * 100).toFixed(2)}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
