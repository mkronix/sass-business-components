
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
}

interface ProgressIndicatorsProps {
  steps: Step[];
  currentStep: number;
  type: 'linear' | 'circular' | 'step-based';
  showLabels?: boolean;
  className?: string;
}

export function ProgressIndicators({ 
  steps, 
  currentStep, 
  type, 
  showLabels = true, 
  className 
}: ProgressIndicatorsProps) {
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  if (type === 'linear') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progressValue)}% Complete
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
        {showLabels && (
          <div className="text-center">
            <h3 className="font-semibold text-foreground">{steps[currentStep]?.title}</h3>
            {steps[currentStep]?.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep].description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'circular') {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progressValue / 100) * circumference;

    return (
      <div className={cn('flex flex-col items-center space-y-4', className)}>
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-muted"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-secondary transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">
              {Math.round(progressValue)}%
            </span>
          </div>
        </div>
        {showLabels && (
          <div className="text-center">
            <h3 className="font-semibold text-foreground">{steps[currentStep]?.title}</h3>
            {steps[currentStep]?.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep].description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'step-based') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    index < currentStep
                      ? 'bg-secondary border-secondary text-secondary-foreground'
                      : index === currentStep
                      ? 'border-secondary text-secondary bg-background'
                      : 'border-muted text-muted-foreground bg-background'
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {showLabels && (
                  <div className="text-center">
                    <div className={cn(
                      'text-xs font-medium',
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {step.title}
                    </div>
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-all',
                    index < currentStep ? 'bg-secondary' : 'bg-muted'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
