

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FormProvider, FormConfig, useForm } from '@/contexts/FormContext';
import { DynamicFormField } from './DynamicFormField';
import { ProgressIndicators } from './ProgressIndicators';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: FormConfig['fields'];
  condition?: (data: Record<string, any>) => boolean;
  canSkip?: boolean;
}

interface WizardFormProps {
  steps: WizardStep[];
  className?: string;
  showBreadcrumbs?: boolean;
  showProgress?: boolean;
  progressType?: 'linear' | 'circular' | 'step-based';
  onComplete?: (data: Record<string, any>) => void;
  onStepChange?: (step: number) => void;
  onStepValidation?: (step: number, isValid: boolean) => void;
}

function WizardFormContent({
  steps,
  className,
  showBreadcrumbs = true,
  showProgress = true,
  progressType = 'step-based',
  onComplete,
  onStepChange,
  onStepValidation
}: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { state } = useForm();

  // Filter steps based on conditions
  const visibleSteps = steps.filter(step =>
    !step.condition || step.condition(state.values)
  );

  const currentStepData = visibleSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === visibleSteps.length - 1;

  const validateCurrentStep = (): boolean => {
    // Simple validation - check if required fields have values
    const isValid = currentStepData.fields
      .filter(field => field.required)
      .every(field => {
        const value = state.values[field.id];
        return value && value.toString().trim() !== '';
      });

    onStepValidation?.(currentStep, isValid);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep() && !isLastStep) {
      const nextStep = currentStep + 1;
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleSkip = () => {
    if (currentStepData.canSkip && !isLastStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      if (isLastStep) {
        onComplete?.(state.values);
      } else {
        handleNext();
      }
    }
  };

  React.useEffect(() => {
    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isLastStep]);

  const progressSteps = visibleSteps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    completed: completedSteps.has(index),
    active: index === currentStep
  }));

  const formClassName = cn(
    "bg-form-background border border-form-border shadow-form rounded-form p-8 w-full  transition-form",
    className
  );

  return (
    <div className={formClassName}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              {visibleSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <BreadcrumbItem>
                    {index < currentStep || completedSteps.has(index) ? (
                      <BreadcrumbLink
                        className="cursor-pointer hover:text-foreground"
                        onClick={() => jumpToStep(index)}
                      >
                        {step.title}
                      </BreadcrumbLink>
                    ) : index === currentStep ? (
                      <BreadcrumbPage>{step.title}</BreadcrumbPage>
                    ) : (
                      <span className="text-muted-foreground">{step.title}</span>
                    )}
                  </BreadcrumbItem>
                  {index < visibleSteps.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Progress Indicator */}
      {showProgress && (
        <div className="mb-8">
          <ProgressIndicators
            steps={progressSteps}
            currentStep={currentStep}
            type={progressType}
            showLabels={progressType !== 'linear'}
          />
        </div>
      )}

      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-foreground">{currentStepData.title}</h2>
        {currentStepData.description && (
          <p className="text-muted-foreground">{currentStepData.description}</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-6 mb-8">
          {currentStepData.fields.map((field) => (
            <DynamicFormField
              key={field.id}
              field={field}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            {currentStepData.canSkip && !isLastStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            )}

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {visibleSteps.length}
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="flex items-center gap-2"
          >
            {isLastStep ? 'Complete' : 'Next'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function WizardForm(props: WizardFormProps) {
  // Create a combined config for the FormProvider with all fields from all steps
  const allFields = props.steps.flatMap(step => step.fields);
  const combinedConfig: FormConfig = {
    fields: allFields,
    gridColumns: 1,
    spacing: 'lg',
    variant: 'default',
    onSubmit: (data) => {
      // This will be handled by the WizardFormContent component
      console.log('Wizard form data:', data);
    }
  };

  return (
    <FormProvider config={combinedConfig}>
      <WizardFormContent {...props} />
    </FormProvider>
  );
}

