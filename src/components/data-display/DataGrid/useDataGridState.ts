
import { useState, useMemo, useEffect } from 'react';
import { GridColumn, SortConfig, FilterConfig } from './types';

interface UseDataGridStateProps<T> {
    data: T[];
    columns: GridColumn<T>[];
    pageSize: number;
    enableMultiSelect: boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
}

export const useDataGridState = <T extends Record<string, any>>({
    data,
    columns,
    pageSize,
    enableMultiSelect,
    onSelectionChange
}: UseDataGridStateProps<T>) => {
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);
    const [filters, setFilters] = useState<Record<string, FilterConfig>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchTerm) {
            const searchableFields = columns
                .filter(col => col.field && !col.hidden)
                .map(col => col.field);

            result = result.filter(item =>
                searchableFields.some(field => {
                    const value = item[field];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([columnId, filter]) => {
            const column = columns.find(col => col.id === columnId);
            if (!column) return;

            result = result.filter(item => {
                const value = item[column.field];
                
                switch (filter.operator) {
                    case 'equals':
                        return value === filter.value;
                    case 'contains':
                        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
                    case 'startsWith':
                        return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
                    case 'endsWith':
                        return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
                    case 'gt':
                        return Number(value) > Number(filter.value);
                    case 'lt':
                        return Number(value) < Number(filter.value);
                    case 'gte':
                        return Number(value) >= Number(filter.value);
                    case 'lte':
                        return Number(value) <= Number(filter.value);
                    case 'between':
                        return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2);
                    case 'in':
                        return Array.isArray(filter.value) ? filter.value.includes(value) : value === filter.value;
                    default:
                        return true;
                }
            });
        });

        // Apply sorting
        if (sortConfig.length > 0) {
            result.sort((a, b) => {
                for (const sort of sortConfig) {
                    const column = columns.find(col => col.id === sort.columnId);
                    if (!column) continue;

                    const aValue = a[column.field];
                    const bValue = b[column.field];

                    let comparison = 0;
                    if (aValue < bValue) comparison = -1;
                    if (aValue > bValue) comparison = 1;

                    if (comparison !== 0) {
                        return sort.direction === 'desc' ? -comparison : comparison;
                    }
                }
                return 0;
            });
        }

        return result;
    }, [data, columns, searchTerm, filters, sortConfig]);

    // Highlighted data for search
    const highlightedData = useMemo(() => {
        if (!searchTerm) return filteredData;
        
        return filteredData.map(item => ({
            ...item,
            _highlighted: true
        }));
    }, [filteredData, searchTerm]);

    const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
        setSortConfig([{ columnId, direction, priority: 0 }]);
    };

    const handleFilter = (columnId: string, filter: FilterConfig | null) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (filter) {
                newFilters[columnId] = filter;
            } else {
                delete newFilters[columnId];
            }
            return newFilters;
        });
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSelectRow = (row: T) => {
        setSelectedRows(prev => {
            let newSelection: T[];
            
            if (enableMultiSelect) {
                const isSelected = prev.includes(row);
                newSelection = isSelected 
                    ? prev.filter(r => r !== row)
                    : [...prev, row];
            } else {
                newSelection = prev.includes(row) ? [] : [row];
            }
            
            return newSelection;
        });
    };

    const handleSelectAll = () => {
        const allSelected = selectedRows.length === filteredData.length;
        const newSelection = allSelected ? [] : [...filteredData];
        setSelectedRows(newSelection);
    };

    const clearSelection = () => {
        setSelectedRows([]);
    };

    // Notify parent of selection changes
    useEffect(() => {
        onSelectionChange?.(selectedRows);
    }, [selectedRows, onSelectionChange]);

    return {
        filteredData,
        selectedRows,
        sortConfig,
        filters,
        searchTerm,
        currentPage,
        highlightedData,
        handleSort,
        handleFilter,
        handleSearch,
        handleSelectRow,
        handleSelectAll,
        clearSelection,
        setCurrentPage
    };
};
