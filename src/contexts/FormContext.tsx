import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FieldConfig {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  gridColumn?: number;
  gridColumnSpan?: number;
  tabOrder?: number;
  ariaLabel?: string;
  ariaDescription?: string;
  helpText?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
  options?: Array<{ value: string; label: string }>;
  value?: any;
  error?: string;
  disabled?: boolean;
  className?: string;
  floatingLabel?: boolean;
  conditional?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: any;
  };
}

export interface FormConfig {
  fields: FieldConfig[];
  gridColumns: number;
  spacing?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'minimal';
  keyboardShortcuts?: Record<string, () => void>;
  onSubmit?: (data: Record<string, any>) => void;
  onChange?: (field: string, value: any) => void;
  onFieldFocus?: (field: string) => void;
  onFieldBlur?: (field: string) => void;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  config: FormConfig;
  focusedField?: string;
}

type FormAction =
  | { type: 'SET_FIELD_VALUE'; field: string; value: any }
  | { type: 'SET_FIELD_ERROR'; field: string; error: string }
  | { type: 'CLEAR_FIELD_ERROR'; field: string }
  | { type: 'SET_FIELD_TOUCHED'; field: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_FOCUSED_FIELD'; field: string }
  | { type: 'RESET_FORM' }
  | { type: 'SET_CONFIG'; config: FormConfig }
  | { type: 'VALIDATE_FIELD'; field: string; value: any };

const initialState: FormState = {
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
  config: {
    fields: [],
    gridColumns: 1,
  },
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error,
        },
      };
    case 'CLEAR_FIELD_ERROR':
      const { [action.field]: _, ...restErrors } = state.errors;
      return {
        ...state,
        errors: restErrors,
      };
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'SET_FOCUSED_FIELD':
      return {
        ...state,
        focusedField: action.field,
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        config: state.config,
      };
    case 'SET_CONFIG':
      const initialValues: Record<string, any> = {};
      action.config.fields.forEach(field => {
        if (field.value !== undefined) {
          initialValues[field.id] = field.value;
        }
      });
      return {
        ...state,
        config: action.config,
        values: { ...state.values, ...initialValues },
      };
    case 'VALIDATE_FIELD':
      const field = state.config.fields.find(f => f.id === action.field);
      if (!field?.validation) return state;
      
      let error = '';
      const value = action.value;
      
      // Required validation
      if (field.required && (!value || value.toString().trim() === '')) {
        error = `${field.label} is required`;
      }
      
      // Pattern validation
      if (!error && field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          error = `${field.label} format is invalid`;
        }
      }
      
      // Length validation
      if (!error && field.validation.minLength && value && value.length < field.validation.minLength) {
        error = `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      
      if (!error && field.validation.maxLength && value && value.length > field.validation.maxLength) {
        error = `${field.label} must be no more than ${field.validation.maxLength} characters`;
      }
      
      // Number validation
      if (!error && field.validation.min !== undefined && value < field.validation.min) {
        error = `${field.label} must be at least ${field.validation.min}`;
      }
      
      if (!error && field.validation.max !== undefined && value > field.validation.max) {
        error = `${field.label} must be no more than ${field.validation.max}`;
      }
      
      // Custom validation
      if (!error && field.validation.custom) {
        const customError = field.validation.custom(value);
        if (customError) error = customError;
      }
      
      if (error) {
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.field]: error,
          },
        };
      } else {
        const { [action.field]: _, ...restErrors } = state.errors;
        return {
          ...state,
          errors: restErrors,
        };
      }
    default:
      return state;
  }
}

interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  setFieldTouched: (field: string) => void;
  setFocusedField: (field: string) => void;
  validateField: (field: string, value: any) => void;
  resetForm: () => void;
  submitForm: () => void;
  isFieldVisible: (field: FieldConfig) => boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children, config }: { children: ReactNode; config: FormConfig }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  React.useEffect(() => {
    dispatch({ type: 'SET_CONFIG', config });
  }, [config]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (config.keyboardShortcuts) {
        const shortcut = Object.keys(config.keyboardShortcuts).find(key => {
          const keys = key.split('+');
          return keys.every(k => {
            switch (k.toLowerCase()) {
              case 'ctrl': return e.ctrlKey;
              case 'shift': return e.shiftKey;
              case 'alt': return e.altKey;
              case 'meta': return e.metaKey;
              default: return e.key.toLowerCase() === k.toLowerCase();
            }
          });
        });
        
        if (shortcut) {
          e.preventDefault();
          config.keyboardShortcuts[shortcut]();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [config.keyboardShortcuts]);

  const setFieldValue = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD_VALUE', field, value });
    dispatch({ type: 'VALIDATE_FIELD', field, value });
    config.onChange?.(field, value);
  };

  const setFieldError = (field: string, error: string) => {
    dispatch({ type: 'SET_FIELD_ERROR', field, error });
  };

  const clearFieldError = (field: string) => {
    dispatch({ type: 'CLEAR_FIELD_ERROR', field });
  };

  const setFieldTouched = (field: string) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', field });
  };

  const setFocusedField = (field: string) => {
    dispatch({ type: 'SET_FOCUSED_FIELD', field });
    config.onFieldFocus?.(field);
  };

  const validateField = (field: string, value: any) => {
    dispatch({ type: 'VALIDATE_FIELD', field, value });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const submitForm = () => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    
    // Validate all fields
    const hasErrors = state.config.fields.some(field => {
      const value = state.values[field.id];
      dispatch({ type: 'VALIDATE_FIELD', field: field.id, value });
      return state.errors[field.id];
    });

    if (!hasErrors) {
      config.onSubmit?.(state.values);
    }
    
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
  };

  const isFieldVisible = (field: FieldConfig): boolean => {
    if (!field.conditional) return true;
    
    const conditionValue = state.values[field.conditional.field];
    const targetValue = field.conditional.value;
    
    switch (field.conditional.operator) {
      case 'equals':
        return conditionValue === targetValue;
      case 'not_equals':
        return conditionValue !== targetValue;
      case 'contains':
        return conditionValue && conditionValue.includes(targetValue);
      default:
        return true;
    }
  };

  return (
    <FormContext.Provider
      value={{
        state,
        dispatch,
        setFieldValue,
        setFieldError,
        clearFieldError,
        setFieldTouched,
        setFocusedField,
        validateField,
        resetForm,
        submitForm,
        isFieldVisible,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
