import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import KnowledgeBase from "@/components/onboarding/steps/KnowledgeBase";
import JobDirectories from "@/components/onboarding/steps/JobDirectories";
import Preferences from "@/components/onboarding/steps/Preferences";
import type { OnboardingStep, Resource } from "@/types";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const STEPS: { id: OnboardingStep; label: string; description: string }[] = [
  {
    id: 1,
    label: "Knowledge Base",
    description: "Upload your professional context",
  },
  {
    id: 2,
    label: "Job Directories",
    description: "Connect your job sources",
  },
  {
    id: 3,
    label: "Preferences",
    description: "Configure your automation engine",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const transition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export default function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [direction, setDirection] = useState(1);
  const [resources, setResources] = useState<Resource[]>([]);
  const [connectedDirectories, setConnectedDirectories] = useState<string[]>(
    [],
  );

  const progressValue = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const goToStep = useCallback(
    (step: OnboardingStep) => {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep],
  );

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      goToStep((currentStep + 1) as OnboardingStep);
    } else {
      onComplete();
    }
  }, [currentStep, goToStep, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as OnboardingStep);
    }
  }, [currentStep, goToStep]);

  const isLastStep = currentStep === 3;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/25">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Career OS
          </span>
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          Step {currentStep} of {STEPS.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-border shrink-0">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${progressValue === 0 ? 5 : progressValue}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-10 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Step indicator pills */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((step, idx) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (step.id < currentStep) {
                        goToStep(step.id);
                      }
                    }}
                    disabled={step.id > currentStep}
                    className={[
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCompleted
                          ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/15"
                          : "bg-muted text-muted-foreground cursor-not-allowed",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="font-mono">{idx + 1}</span>
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={[
                        "h-px w-6 transition-colors duration-500",
                        currentStep > step.id ? "bg-primary/40" : "bg-border",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step header */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`header-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="mb-6"
            >
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {STEPS[currentStep - 1].label}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {STEPS[currentStep - 1].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {currentStep === 1 && (
                <KnowledgeBase
                  resources={resources}
                  onResourcesChange={setResources}
                />
              )}
              {currentStep === 2 && (
                <JobDirectories
                  connectedDirectories={connectedDirectories}
                  onConnectionChange={setConnectedDirectories}
                />
              )}
              {currentStep === 3 && <Preferences onSubmit={onComplete} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep !== 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mt-8 pt-6 border-t border-border"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-1.5 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                {/* Dot progress */}
                <div className="flex items-center gap-1.5">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className={[
                        "rounded-full transition-all duration-300",
                        currentStep === step.id
                          ? "w-4 h-1.5 bg-primary"
                          : currentStep > step.id
                            ? "w-1.5 h-1.5 bg-primary/40"
                            : "w-1.5 h-1.5 bg-border",
                      ].join(" ")}
                    />
                  ))}
                </div>

                <Button size="sm" onClick={handleNext} className="gap-1.5">
                  {isLastStep ? "Launch" : "Continue"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Inline progress for the whole wizard */}
      <div className="border-t border-border px-6 py-3 flex items-center justify-between shrink-0">
        <Progress
          value={((currentStep - 1) / STEPS.length) * 100 + 10}
          className="h-1 flex-1 max-w-30"
        />
        <span className="text-xs font-mono text-muted-foreground ml-3">
          {Math.round(((currentStep - 1) / STEPS.length) * 100 + 10)}% setup
          complete
        </span>
      </div>
    </div>
  );
}
