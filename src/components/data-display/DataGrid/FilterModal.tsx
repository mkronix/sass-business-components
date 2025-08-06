import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { GridColumn, FilterConfig } from './types';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    columns: GridColumn[];
    filters: Record<string, FilterConfig>;
    onFilter: (columnId: string, filter: FilterConfig | null) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    columns,
    filters,
    onFilter
}) => {
    const [tempFilters, setTempFilters] = useState<Record<string, FilterConfig>>(filters);
    const [newFilterColumn, setNewFilterColumn] = useState<string>('');

    const filterableColumns = columns.filter(col => col.filterable && !col.hidden);

    const getOperatorOptions = (type: string) => {
        switch (type) {
            case 'text':
                return [
                    { value: 'contains', label: 'Contains' },
                    { value: 'equals', label: 'Equals' },
                    { value: 'startsWith', label: 'Starts with' },
                    { value: 'endsWith', label: 'Ends with' }
                ];
            case 'number':
                return [
                    { value: 'equals', label: 'Equals' },
                    { value: 'gt', label: 'Greater than' },
                    { value: 'lt', label: 'Less than' },
                    { value: 'gte', label: 'Greater than or equal' },
                    { value: 'lte', label: 'Less than or equal' },
                    { value: 'between', label: 'Between' }
                ];
            case 'date':
                return [
                    { value: 'equals', label: 'Equals' },
                    { value: 'gt', label: 'After' },
                    { value: 'lt', label: 'Before' },
                    { value: 'between', label: 'Between' }
                ];
            case 'select':
            case 'boolean':
                return [
                    { value: 'equals', label: 'Equals' },
                    { value: 'in', label: 'In' }
                ];
            default:
                return [{ value: 'contains', label: 'Contains' }];
        }
    };

    const updateTempFilter = (columnId: string, updates: Partial<FilterConfig>) => {
        setTempFilters(prev => ({
            ...prev,
            [columnId]: { ...prev[columnId], ...updates }
        }));
    };

    const addNewFilter = () => {
        if (!newFilterColumn) return;
        
        const column = columns.find(col => col.id === newFilterColumn);
        if (!column) return;

        const defaultOperator = getOperatorOptions(column.type || 'text')[0].value;
        setTempFilters(prev => ({
            ...prev,
            [newFilterColumn]: {
                type: (column.type as any) || 'text',
                operator: defaultOperator as any,
                value: ''
            }
        }));
        setNewFilterColumn('');
    };

    const removeFilter = (columnId: string) => {
        setTempFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[columnId];
            return newFilters;
        });
    };

    const applyFilters = () => {
        // Apply all temp filters
        Object.entries(tempFilters).forEach(([columnId, filter]) => {
            onFilter(columnId, filter);
        });

        // Remove filters that were removed in temp
        Object.keys(filters).forEach(columnId => {
            if (!tempFilters[columnId]) {
                onFilter(columnId, null);
            }
        });

        onClose();
    };

    const clearAllFilters = () => {
        setTempFilters({});
        Object.keys(filters).forEach(columnId => {
            onFilter(columnId, null);
        });
    };

    const renderFilterInput = (column: GridColumn, filter: FilterConfig) => {
        switch (column.type) {
            case 'select':
                return (
                    <Select
                        value={filter.value}
                        onValueChange={(value) => updateTempFilter(column.id, { value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select value..." />
                        </SelectTrigger>
                        <SelectContent>
                            {column.options?.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'boolean':
                return (
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <Checkbox
                                checked={filter.value === true}
                                onCheckedChange={(checked) => 
                                    updateTempFilter(column.id, { value: checked })
                                }
                            />
                            <span>True</span>
                        </label>
                    </div>
                );

            case 'number':
                return (
                    <div className="space-y-2">
                        <Input
                            type="number"
                            placeholder="Value"
                            value={filter.value || ''}
                            onChange={(e) => updateTempFilter(column.id, { 
                                value: parseFloat(e.target.value) || '' 
                            })}
                        />
                        {filter.operator === 'between' && (
                            <Input
                                type="number"
                                placeholder="Second value"
                                value={filter.value2 || ''}
                                onChange={(e) => updateTempFilter(column.id, { 
                                    value2: parseFloat(e.target.value) || '' 
                                })}
                            />
                        )}
                    </div>
                );

            case 'date':
                return (
                    <div className="space-y-2">
                        <Input
                            type="date"
                            value={filter.value || ''}
                            onChange={(e) => updateTempFilter(column.id, { value: e.target.value })}
                        />
                        {filter.operator === 'between' && (
                            <Input
                                type="date"
                                value={filter.value2 || ''}
                                onChange={(e) => updateTempFilter(column.id, { value2: e.target.value })}
                            />
                        )}
                    </div>
                );

            default:
                return (
                    <Input
                        placeholder="Enter value..."
                        value={filter.value || ''}
                        onChange={(e) => updateTempFilter(column.id, { value: e.target.value })}
                    />
                );
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[400px] sm:min-w-[500px]">
                <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetDescription>
                        Create advanced filters to refine your data view
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Existing Filters */}
                    <div className="space-y-4">
                        {Object.entries(tempFilters).map(([columnId, filter]) => {
                            const column = columns.find(col => col.id === columnId);
                            if (!column) return null;

                            return (
                                <div key={columnId} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-medium">{column.title}</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFilter(columnId)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm">Operator</Label>
                                            <Select
                                                value={filter.operator}
                                                onValueChange={(value) => updateTempFilter(columnId, { 
                                                    operator: value as any 
                                                })}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getOperatorOptions(column.type || 'text').map(op => (
                                                        <SelectItem key={op.value} value={op.value}>
                                                            {op.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm">Value</Label>
                                            <div className="mt-1">
                                                {renderFilterInput(column, filter)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add New Filter */}
                    <div className="border-t pt-4">
                        <Label className="font-medium">Add Filter</Label>
                        <div className="flex gap-2 mt-2">
                            <Select value={newFilterColumn} onValueChange={setNewFilterColumn}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select column..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterableColumns
                                        .filter(col => !tempFilters[col.id])
                                        .map(col => (
                                            <SelectItem key={col.id} value={col.id}>
                                                {col.title}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addNewFilter}
                                disabled={!newFilterColumn}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={clearAllFilters}>
                            Clear All
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={applyFilters}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
