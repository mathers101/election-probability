import { Card, CardContent } from "@/components/ui/card";

export default function VictoryProbabilitiesPlaceholder() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-2 text-center">
          <p className="text-xl font-semibold text-muted-foreground">Election Probabilities</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Once you fill in your predictions for the swing states, this section will show the probability of a Harris
            victory, Trump victory, or a draw based on your inputs.
          </p>
          <p className="mt-3 text-purple-700 text-sm">Select the swing states below to get started.</p>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg">
            For simplicity, we treat non-swing states as safe for their usual party, but you’re welcome to edit these if
            you’d like.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
