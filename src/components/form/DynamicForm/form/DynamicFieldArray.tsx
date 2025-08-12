
import React from 'react';
import { Plus, Minus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormProvider, FormConfig, FieldConfig } from '@/contexts/FormContext';
import { DynamicFormField } from './DynamicFormField';

interface FieldArrayConfig {
  id: string;
  label: string;
  fields: FieldConfig[];
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
  removeButtonText?: string;
  sortable?: boolean;
  collapsible?: boolean;
}

interface DynamicFieldArrayProps {
  config: FieldArrayConfig;
  className?: string;
}

interface FieldArrayItemProps {
  index: number;
  item: Record<string, any>;
  fields: FieldConfig[];
  onUpdate: (fieldId: string, value: any) => void;
  onRemove: () => void;
  canRemove: boolean;
  sortable?: boolean;
}

function FieldArrayItem({
  index,
  item,
  fields,
  onUpdate,
  onRemove,
  canRemove,
  sortable
}: FieldArrayItemProps) {
  // Create a FormConfig for this specific item with proper field mapping
  const itemFields = fields.map(field => ({
    ...field,
    id: `${field.id}_${index}`, // Make field IDs unique per item
    value: item[field.id] || field.value || ''
  }));

  const itemFormConfig: FormConfig = {
    fields: itemFields,
    gridColumns: 1,
    spacing: 'md',
    variant: 'minimal',
    onChange: (fieldId, value) => {
      // Extract the original field ID (remove the _index suffix)
      const originalFieldId = fieldId.replace(`_${index}`, '');
      onUpdate(originalFieldId, value);
    }
  };

  return (
    <FormProvider config={itemFormConfig}>
      <div className="relative border border-border p-4 bg-form-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {sortable && (
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
            )}
            <span className="text-sm font-medium text-foreground">
              Item {index + 1}
            </span>
          </div>
          <Button
            type="button"
            onClick={onRemove}
            variant="ghost"
            size="sm"
            disabled={!canRemove}
            className="text-destructive hover:text-destructive"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {itemFields.map((field) => (
            <DynamicFormField
              key={field.id}
              field={field}
            />
          ))}
        </div>
      </div>
    </FormProvider>
  );
}

function DynamicFieldArrayContent({ config, className }: DynamicFieldArrayProps) {
  const [arrayValue, setArrayValue] = React.useState<Record<string, any>[]>([{}]);

  const addItem = () => {
    if (!config.maxItems || arrayValue.length < config.maxItems) {
      const newItem = {};
      config.fields.forEach(field => {
        newItem[field.id] = field.value || '';
      });
      setArrayValue([...arrayValue, newItem]);
    }
  };

  const removeItem = (index: number) => {
    if (!config.minItems || arrayValue.length > config.minItems) {
      const newArray = arrayValue.filter((_, i) => i !== index);
      setArrayValue(newArray);
    }
  };

  const updateItem = (index: number, fieldId: string, value: any) => {
    const newArray = [...arrayValue];
    newArray[index] = { ...newArray[index], [fieldId]: value };
    setArrayValue(newArray);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{config.label}</h3>
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          size="sm"
          disabled={config.maxItems && arrayValue.length >= config.maxItems}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {config.addButtonText || 'Add Item'}
        </Button>
      </div>

      <div className="space-y-4">
        {arrayValue.map((item, index) => (
          <FieldArrayItem
            key={index}
            index={index}
            item={item}
            fields={config.fields}
            onUpdate={(fieldId, value) => updateItem(index, fieldId, value)}
            onRemove={() => removeItem(index)}
            canRemove={!config.minItems || arrayValue.length > config.minItems}
            sortable={config.sortable}
          />
        ))}
      </div>
    </div>
  );
}

export function DynamicFieldArray(props: DynamicFieldArrayProps) {
  // Create a minimal FormProvider wrapper for the entire component
  // This ensures DynamicFieldArray can be used standalone
  const wrapperConfig: FormConfig = {
    fields: [],
    gridColumns: 1,
    spacing: 'sm',
    variant: 'minimal'
  };

  return (
    <FormProvider config={wrapperConfig}>
      <DynamicFieldArrayContent {...props} />
    </FormProvider>
  );
}
