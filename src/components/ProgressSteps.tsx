import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 transition-opacity",
              index > currentStep && "opacity-50"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary",
                !isCompleted && !isCurrent && "border-muted"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <h3 className="font-medium leading-none">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;