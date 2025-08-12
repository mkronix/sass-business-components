import React from 'react';
import { cn } from '@/lib/utils';
import { FormProvider, FormConfig } from '@/contexts/FormContext';
import { DynamicFormField } from './DynamicFormField';
import { Button } from '@/components/ui/button';

interface DynamicFormProps {
  config: FormConfig;
  className?: string;
  showSubmitButton?: boolean;
  submitButtonText?: string;
  children?: React.ReactNode;
}

function DynamicFormContent({ 
  config, 
  className, 
  showSubmitButton = true, 
  submitButtonText = "Submit",
  children 
}: DynamicFormProps) {
  const spacingClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const variantClasses = {
    default: 'bg-form-background border border-form-border shadow-form rounded-form p-6',
    outlined: 'border-2 border-form-border rounded-form p-6',
    minimal: 'p-4',
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const formClassName = cn(
    variantClasses[config.variant || 'default'],
    "w-full max-w-none transition-form",
    className
  );

  const gridClassName = cn(
    "grid w-full",
    gridCols[Math.min(config.gridColumns, 6) as keyof typeof gridCols] || gridCols[1],
    spacingClasses[config.spacing || 'md']
  );

  return (
    <form 
      className={formClassName}
      onSubmit={(e) => {
        e.preventDefault();
        // Form submission is handled by the FormContext
      }}
    >
      <div className={gridClassName}>
        {config.fields.map((field) => (
          <DynamicFormField
            key={field.id}
            field={field}
          />
        ))}
      </div>
      
      {children}
      
      {showSubmitButton && (
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit"
            variant="secondary"
            className="px-8"
          >
            {submitButtonText}
          </Button>
        </div>
      )}
    </form>
  );
}

export function DynamicForm(props: DynamicFormProps) {
  return (
    <FormProvider config={props.config}>
      <DynamicFormContent {...props} />
    </FormProvider>
  );
}