
import React from 'react';
import { cn } from '@/lib/utils';
import { useForm, FieldConfig, FormProvider, FormConfig } from '@/contexts/FormContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DynamicFormFieldProps {
  field: FieldConfig;
  className?: string;
}

function DynamicFormFieldContent({ field, className }: Readonly<DynamicFormFieldProps>) {
  const { state, setFieldValue, setFieldTouched } = useForm();

  const value = state.values[field.id] || '';
  const error = state.errors[field.id];
  const touched = state.touched[field.id];

  const handleChange = (newValue: any) => {
    setFieldValue(field.id, newValue);
  };

  const handleBlur = () => {
    setFieldTouched(field.id);
    state.config.onFieldBlur?.(field.id);
  };

  const handleFocus = () => {
    state.config.onFieldFocus?.(field.id);
  };

  const gridColumnStyle = field.gridColumnSpan
    ? { gridColumn: `span ${field.gridColumnSpan}` }
    : {};

  const fieldClassName = cn(
    "transition-form",
    "focus-within:shadow-form-focus",
    className,
    field.className
  );

  const inputClassName = cn(
    "bg-input border-border text-foreground placeholder:text-muted-foreground",
    "",
    "transition-form rounded-md",
    error && touched && "border-destructive focus:border-destructive focus:ring-destructive/20",
    field.disabled && "opacity-50 cursor-not-allowed"
  );

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            name={field.id}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={cn(inputClassName, "min-h-[100px] resize-vertical")}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={handleChange}
            disabled={field.disabled}
          >
            <SelectTrigger className={inputClassName} onBlur={handleBlur} onFocus={handleFocus}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="focus:bg-accent focus:text-accent-foreground"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 p-4 rounded-md border border-border bg-card/50">
            <Checkbox
              id={field.id}
              checked={value}
              onCheckedChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={field.disabled}
              className="border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary mt-0.5"
            />
            <Label
              htmlFor={field.id}
              className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <div className="p-4 rounded-md border border-border bg-card/50">
            <RadioGroup
              value={value}
              onValueChange={handleChange}
              disabled={field.disabled}
              className="space-y-3"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.id}-${option.value}`}
                    className="border-border text-secondary"
                  />
                  <Label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return (
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={inputClassName}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            pattern={field.validation?.pattern}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className={fieldClassName} style={gridColumnStyle}>
      {field.type !== 'checkbox' && (
        <Label
          htmlFor={field.id}
          className="text-sm font-medium mb-3 block text-foreground"
        >
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {renderField()}

      {error && touched && (
        <p className="text-destructive text-xs mt-2 animate-in slide-in-from-top-1 duration-200 bg-destructive/10 px-3 py-1 rounded">
          {error}
        </p>
      )}
    </div>
  );
}

export function DynamicFormField(props: DynamicFormFieldProps) {
  try {
    return <DynamicFormFieldContent {...props} />;
  } catch (error) {
    console.error("Error rendering dynamic form field:", error);
    const fieldConfig: FormConfig = {
      fields: [props.field],
      gridColumns: 1,
      spacing: 'md',
      variant: 'minimal'
    };
    return (
      <FormProvider config={fieldConfig}>
        <DynamicFormFieldContent {...props} />
      </FormProvider>
    );
  }
}
