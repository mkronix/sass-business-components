
import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFormField } from './DynamicFormField';
import { FieldConfig } from '@/contexts/FormContext';

interface LayoutGroup {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  className?: string;
}

interface LayoutTemplateProps {
  groups: LayoutGroup[];
  template: 'card' | 'accordion' | 'tabs';
  className?: string;
}

export function LayoutTemplate({ groups, template, className }: LayoutTemplateProps) {
  const renderFields = (fields: FieldConfig[], gridCols: string = 'grid-cols-1') => (
    <div className={cn('grid gap-4 bg-form-background p-4', gridCols)}>
      {fields.map((field) => (
        <DynamicFormField key={field.id} field={field} />
      ))}
    </div>
  );

  switch (template) {
    case 'card':
      return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
          {groups.map((group) => (
            <Card key={group.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{group.title}</CardTitle>
                {group.description && (
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                )}
              </CardHeader>
              <CardContent>
                {renderFields(group.fields)}
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case 'accordion':
      return (
        <Accordion type="multiple" className={cn('w-full', className)}>
          {groups.map((group) => (
            <AccordionItem key={group.id} value={group.id} className="border-border">
              <AccordionTrigger className="text-foreground hover:text-foreground">
                <div className="text-left">
                  <div className="font-semibold">{group.title}</div>
                  {group.description && (
                    <div className="text-sm text-muted-foreground font-normal">
                      {group.description}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                {renderFields(group.fields)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );

    case 'tabs':
      return (
        <Tabs defaultValue={groups[0]?.id} className={className}>
          <TabsList className="grid w-full bg-muted" style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}>
            {groups.map((group) => (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="text-muted-foreground data-[state=active]:text-foreground"
              >
                {group.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map((group) => (
            <TabsContent key={group.id} value={group.id} className="mt-6">
              {group.description && (
                <p className="text-muted-foreground mb-4">{group.description}</p>
              )}
              {renderFields(group.fields)}
            </TabsContent>
          ))}
        </Tabs>
      );

    default:
      return null;
  }
}
