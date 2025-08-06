
import React from 'react';
import { Search, Filter, MoreHorizontal, Download, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GridColumn, FilterConfig } from './types';
import { cn } from '@/lib/utils';

interface DataGridToolbarProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    filters: Record<string, FilterConfig>;
    onFilter: (columnId: string, filter: FilterConfig | null) => void;
    columns: GridColumn[];
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onOpenFilterModal: () => void;
    enableBulkOperations: boolean;
    enableExport: boolean;
    enableRowSelection: boolean;
}

export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
    searchTerm,
    onSearch,
    filters,
    onFilter,
    columns,
    selectedCount,
    totalCount,
    onSelectAll,
    onClearSelection,
    onOpenFilterModal,
    enableBulkOperations,
    enableExport,
    enableRowSelection
}) => {
    const activeFiltersCount = Object.keys(filters).length;
    const quickFilterColumns = columns.filter(col => 
        col.filterable && 
        ['select', 'boolean'].includes(col.type || 'text')
    ).slice(0, 3);

    const handleQuickFilter = (column: GridColumn, value: any) => {
        const existingFilter = filters[column.id];
        if (existingFilter && existingFilter.value === value) {
            onFilter(column.id, null); // Remove filter
        } else {
            onFilter(column.id, {
                type: column.type as any || 'text',
                operator: 'equals',
                value
            });
        }
    };

    return (
        <div className="space-y-4">
            {/* Main Toolbar Row */}
            <div className="flex items-center justify-between gap-4">
                {/* Left Side - Search and Quick Filters */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => onSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2">
                        {quickFilterColumns.map((column) => (
                            <div key={column.id} className="flex items-center gap-1">
                                {column.options?.slice(0, 2).map((option) => {
                                    const isActive = filters[column.id]?.value === option.value;
                                    return (
                                        <Button
                                            key={option.value}
                                            variant={isActive ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleQuickFilter(column, option.value)}
                                            className={cn(
                                                "h-8 text-xs",
                                                isActive && "bg-primary text-primary-foreground"
                                            )}
                                        >
                                            {option.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Advanced Filters Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenFilterModal}
                        className="relative"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge 
                                variant="secondary" 
                                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>

                    {enableExport && (
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    )}

                    <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Selection Bar */}
            {enableRowSelection && (
                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={selectedCount === totalCount ? onClearSelection : onSelectAll}
                            className="h-8"
                        >
                            {selectedCount === totalCount ? (
                                <CheckSquare className="h-4 w-4 mr-2" />
                            ) : (
                                <Square className="h-4 w-4 mr-2" />
                            )}
                            {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
                        </Button>

                        {selectedCount > 0 && (
                            <div className="text-sm text-muted-foreground">
                                {selectedCount} of {totalCount} selected
                            </div>
                        )}
                    </div>

                    {enableBulkOperations && selectedCount > 0 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Bulk Edit
                            </Button>
                            <Button variant="outline" size="sm">
                                Delete Selected
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {Object.entries(filters).map(([columnId, filter]) => {
                        const column = columns.find(col => col.id === columnId);
                        return (
                            <Badge
                                key={columnId}
                                variant="secondary"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => onFilter(columnId, null)}
                            >
                                {column?.title}: {filter.value}
                                <span className="ml-1">×</span>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
