import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    ArrowUpDown,
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Edit2,
    Filter,
    FilterX,
    GripVertical,
    Pin,
    PinOff,
    RefreshCw,
    Search,
    Settings,
    SortAsc,
    SortDesc,
    Trash2,
    X
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { CellRendererParams, DataGridProps, FilterConfig, GridApi, GridColumn, SortConfig } from './types';

const DataGrid = <T extends Record<string, any>>({
    data = [],
    columns = [],
    loading = false,
    rowHeight = 48,
    headerHeight = 56,
    enableVirtualScrolling = true,
    enableColumnResize = true,
    enableColumnReorder = true,
    enableColumnPinning = true,
    enableRowSelection = true,
    enableMultiSelect = true,
    enableInlineEditing = true,
    enableBulkOperations = true,
    enableExport = true,
    enableAggregation = true,
    enableContextMenu = true,
    enableUndoRedo = true,
    pageSize = 100,
    pagination = true,
    serverSide = false,
    totalCount,
    className,
    theme = 'auto',
    density = 'standard',
    getRowId = (row) => row.id,
    onRowClick,
    onRowDoubleClick,
    onCellClick,
    onCellEdit,
    onSelectionChange,
    onSortChange,
    onFilterChange,
    onColumnStateChange,
    onPageChange,
    customToolbar,
    customFooter
}: DataGridProps<T>) => {
    // State management
    const [gridData, setGridData] = useState<T[]>(data);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
    const [editingCell, setEditingCell] = useState<{ rowId: string | number; field: string } | null>(null);
    const [editValue, setEditValue] = useState<any>('');
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(col => col.id));
    const [pinnedColumns, setPinnedColumns] = useState<Record<string, 'left' | 'right' | false>>({});
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
    const [sorting, setSorting] = useState<SortConfig[]>([]);
    const [filters, setFilters] = useState<Record<string, FilterConfig>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [searchQuery, setSearchQuery] = useState('');
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [showFilterDialog, setShowFilterDialog] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row?: T } | null>(null);
    const [resizingColumn, setResizingColumn] = useState<string | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [undoStack, setUndoStack] = useState<any[]>([]);
    const [redoStack, setRedoStack] = useState<any[]>([]);

    // Refs
    const gridRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    // Get row height based on density
    const getRowHeight = useCallback(() => {
        switch (density) {
            case 'compact': return 32;
            case 'comfortable': return 64;
            default: return rowHeight;
        }
    }, [density, rowHeight]);

    // Column calculations
    const visibleColumns = useMemo(() => {
        return columns
            .filter(col => !hiddenColumns.has(col.id))
            .sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id));
    }, [columns, hiddenColumns, columnOrder]);

    const pinnedLeftColumns = useMemo(() => {
        return visibleColumns.filter(col => pinnedColumns[col.id] === 'left');
    }, [visibleColumns, pinnedColumns]);

    const pinnedRightColumns = useMemo(() => {
        return visibleColumns.filter(col => pinnedColumns[col.id] === 'right');
    }, [visibleColumns, pinnedColumns]);

    const centerColumns = useMemo(() => {
        return visibleColumns.filter(col => !pinnedColumns[col.id]);
    }, [visibleColumns, pinnedColumns]);

    // Data processing
    const processedData = useMemo(() => {
        let result = [...gridData];

        // Apply global search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(row =>
                visibleColumns.some(col => {
                    const value = row[col.field];
                    return String(value || '').toLowerCase().includes(query);
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([columnId, filter]) => {
            const column = columns.find(col => col.id === columnId);
            if (!column) return;

            result = result.filter(row => {
                const value = row[column.field];
                return applyFilter(value, filter);
            });
        });

        // Apply sorting
        if (sorting.length > 0) {
            result.sort((a, b) => {
                for (const sort of sorting.sort((x, y) => x.priority - y.priority)) {
                    const column = columns.find(col => col.id === sort.columnId);
                    if (!column) continue;

                    const aValue = a[column.field];
                    const bValue = b[column.field];

                    let comparison = 0;
                    if (aValue == null && bValue == null) continue;
                    if (aValue == null) return sort.direction === 'asc' ? 1 : -1;
                    if (bValue == null) return sort.direction === 'asc' ? -1 : 1;

                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        comparison = aValue - bValue;
                    } else if (aValue instanceof Date && bValue instanceof Date) {
                        comparison = aValue.getTime() - bValue.getTime();
                    } else {
                        comparison = String(aValue).localeCompare(String(bValue));
                    }

                    if (comparison !== 0) {
                        return sort.direction === 'asc' ? comparison : -comparison;
                    }
                }
                return 0;
            });
        }

        return result;
    }, [gridData, searchQuery, filters, sorting, columns, visibleColumns]);

    // Pagination
    const paginatedData = useMemo(() => {
        if (!pagination) return processedData;
        const start = (currentPage - 1) * currentPageSize;
        return processedData.slice(start, start + currentPageSize);
    }, [processedData, pagination, currentPage, currentPageSize]);

    const totalPages = Math.ceil(processedData.length / currentPageSize);

    // Filter application logic
    const applyFilter = (value: any, filter: FilterConfig): boolean => {
        if (filter.value === '' || filter.value == null) return true;

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
                return Array.isArray(filter.value) && filter.value.includes(value);
            default:
                return true;
        }
    };

    // Event handlers
    const handleSort = useCallback((columnId: string) => {
        setSorting(prev => {
            const existingSort = prev.find(s => s.columnId === columnId);
            if (existingSort) {
                if (existingSort.direction === 'asc') {
                    return prev.map(s => s.columnId === columnId ? { ...s, direction: 'desc' as const } : s);
                } else {
                    return prev.filter(s => s.columnId !== columnId);
                }
            } else {
                return [...prev, { columnId, direction: 'asc' as const, priority: prev.length }];
            }
        });
    }, []);

    const handleCellEdit = useCallback(async (rowId: string | number, field: string, newValue: any) => {
        const oldValue = gridData.find(row => getRowId(row) === rowId)?.[field];

        if (onCellEdit) {
            const success = await onCellEdit(rowId, field, newValue, oldValue);
            if (!success) return false;
        }

        // Update local data
        setGridData(prev => prev.map(row =>
            getRowId(row) === rowId ? { ...row, [field]: newValue } : row
        ));

        // Add to undo stack
        if (enableUndoRedo) {
            setUndoStack(prev => [...prev, { type: 'edit', rowId, field, oldValue, newValue }]);
            setRedoStack([]);
        }

        return true;
    }, [gridData, onCellEdit, getRowId, enableUndoRedo]);

    const handleRowSelection = useCallback((rowId: string | number, selected: boolean) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(rowId);
            } else {
                newSet.delete(rowId);
            }

            if (onSelectionChange) {
                const selectedRowData = paginatedData.filter(row => newSet.has(getRowId(row)));
                onSelectionChange(selectedRowData);
            }

            return newSet;
        });
    }, [paginatedData, getRowId, onSelectionChange]);

    const handleSelectAll = useCallback(() => {
        const allIds = paginatedData.map(row => getRowId(row));
        const allSelected = allIds.every(id => selectedRows.has(id));

        if (allSelected) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(allIds));
        }
    }, [paginatedData, selectedRows, getRowId]);

    const handleColumnResize = useCallback((columnId: string, width: number) => {
        setColumnWidths(prev => ({ ...prev, [columnId]: Math.max(50, width) }));
    }, []);

    const handleColumnPin = useCallback((columnId: string, pinned: 'left' | 'right' | false) => {
        setPinnedColumns(prev => ({ ...prev, [columnId]: pinned }));
    }, []);

    const handleExport = useCallback((format: 'csv' | 'excel' | 'json') => {
        const exportData = selectedRows.size > 0
            ? processedData.filter(row => selectedRows.has(getRowId(row)))
            : processedData;

        console.log(`Exporting ${exportData.length} rows as ${format}`);
        // Implementation would go here
    }, [processedData, selectedRows, getRowId]);

    // Grid API
    const gridApi: GridApi<T> = useMemo(() => ({
        refreshData: () => setGridData([...data]),
        exportData: handleExport,
        selectAll: handleSelectAll,
        clearSelection: () => setSelectedRows(new Set()),
        getSelectedRows: () => paginatedData.filter(row => selectedRows.has(getRowId(row))),
        addRow: (row) => setGridData(prev => [...prev, row]),
        removeRow: (id) => setGridData(prev => prev.filter(row => getRowId(row) !== id)),
        updateRow: (id, updates) => setGridData(prev => prev.map(row =>
            getRowId(row) === id ? { ...row, ...updates } : row
        )),
        getColumnState: () => visibleColumns.map((col, index) => ({
            id: col.id,
            width: columnWidths[col.id] || col.width || 150,
            pinned: pinnedColumns[col.id] || false,
            hidden: hiddenColumns.has(col.id),
            order: index
        })),
        setColumnState: (state) => {
            setColumnWidths(Object.fromEntries(state.map(s => [s.id, s.width])));
            setPinnedColumns(Object.fromEntries(state.map(s => [s.id, s.pinned])));
            setHiddenColumns(new Set(state.filter(s => s.hidden).map(s => s.id)));
            setColumnOrder(state.sort((a, b) => a.order - b.order).map(s => s.id));
        },
        applyFilter: (columnId, filter) => setFilters(prev => ({ ...prev, [columnId]: filter })),
        clearFilters: () => setFilters({}),
        setSorting: (newSorting) => setSorting(newSorting),
        autoSizeColumns: () => {
            // Auto-size implementation would go here
            console.log('Auto-sizing columns...');
        },
        exportToPDF: () => console.log('Exporting to PDF...')
    }), [
        data, handleExport, handleSelectAll, paginatedData, selectedRows, getRowId,
        visibleColumns, columnWidths, pinnedColumns, hiddenColumns
    ]);

    // Cell renderer
    const renderCell = useCallback((column: GridColumn<T>, row: T, rowIndex: number, columnIndex: number) => {
        const value = row[column.field];
        const rowId = getRowId(row);
        const isEditing = editingCell?.rowId === rowId && editingCell?.field === column.field;

        const cellParams: CellRendererParams<T> = {
            value,
            row,
            column,
            rowIndex,
            columnIndex,
            isEditing,
            startEdit: () => {
                if (column.editable && enableInlineEditing) {
                    setEditingCell({ rowId, field: column.field });
                    setEditValue(value);
                }
            },
            stopEdit: () => setEditingCell(null),
            api: gridApi
        };

        if (isEditing) {
            return (
                <div className="flex items-center gap-2 px-2">
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCellEdit(rowId, column.field, editValue);
                                setEditingCell(null);
                            }
                            if (e.key === 'Escape') {
                                setEditingCell(null);
                            }
                        }}
                        className="h-8 text-sm"
                        autoFocus
                    />
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            handleCellEdit(rowId, column.field, editValue);
                            setEditingCell(null);
                        }}
                        className="h-6 w-6 p-0"
                    >
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCell(null)}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            );
        }

        if (column.cellRenderer) {
            return column.cellRenderer(cellParams);
        }

        // Default cell rendering based on column type
        let displayValue = value;
        if (column.format) {
            displayValue = column.format(value);
        } else if (column.type === 'date' && value instanceof Date) {
            displayValue = value.toLocaleDateString();
        } else if (column.type === 'number') {
            displayValue = typeof value === 'number' ? value.toLocaleString() : value;
        } else if (column.type === 'boolean') {
            displayValue = value ? '✓' : '✗';
        }

        return (
            <div
                className={cn(
                    "px-3 py-2 text-sm truncate cursor-pointer",
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.editable && enableInlineEditing && 'hover:bg-muted/50'
                )}
                onClick={() => cellParams.startEdit()}
            >
                {String(displayValue || '')}
            </div>
        );
    }, [editingCell, editValue, enableInlineEditing, gridApi, getRowId, handleCellEdit]);

    // Render column sections
    const renderColumnSection = (columnsToRender: GridColumn<T>[], sectionClass = '') => (
        <div className={cn("flex", sectionClass)}>
            {columnsToRender.map((column, columnIndex) => {
                const width = columnWidths[column.id] || column.width || 150;
                return (
                    <div
                        key={column.id}
                        className="border-r border-border last:border-r-0"
                        style={{ width, minWidth: width }}
                    >
                        {/* Header */}
                        <div
                            className={cn(
                                "flex items-center justify-between px-3 py-2 font-medium text-sm bg-muted/30 border-b",
                                "hover:bg-muted/50 transition-colors cursor-pointer"
                            )}
                            style={{ height: headerHeight }}
                            onClick={() => column.sortable && handleSort(column.id)}
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="truncate">{column.title}</span>
                                {column.sortable && (
                                    <div className="flex-shrink-0">
                                        {(() => {
                                            const sort = sorting.find(s => s.columnId === column.id);
                                            if (!sort) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
                                            return sort.direction === 'asc'
                                                ? <SortAsc className="h-3 w-3 text-primary" />
                                                : <SortDesc className="h-3 w-3 text-primary" />;
                                        })()}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                                {filters[column.id] && (
                                    <Filter className="h-3 w-3 text-primary" />
                                )}

                                {enableColumnPinning && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentPin = pinnedColumns[column.id];
                                            handleColumnPin(column.id, currentPin === 'left' ? false : 'left');
                                        }}
                                    >
                                        {pinnedColumns[column.id] === 'left' ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                                    </Button>
                                )}

                                {enableColumnResize && (
                                    <div
                                        className="h-full w-1 cursor-col-resize hover:bg-primary/50 ml-1"
                                        onMouseDown={(e) => {
                                            setResizingColumn(column.id);
                                            setDragStartX(e.clientX);
                                        }}
                                    >
                                        <GripVertical className="h-3 w-3 opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cells */}
                        <div className="relative">
                            {paginatedData.map((row, rowIndex) => {
                                const rowId = getRowId(row);
                                const isSelected = selectedRows.has(rowId);

                                return (
                                    <div
                                        key={rowId}
                                        className={cn(
                                            "border-b border-border/50 transition-colors",
                                            isSelected && "bg-primary/5",
                                            "hover:bg-muted/30 group"
                                        )}
                                        style={{ height: getRowHeight() }}
                                        onClick={(e) => onRowClick?.(row, e)}
                                        onDoubleClick={(e) => onRowDoubleClick?.(row, e)}
                                        onContextMenu={(e) => {
                                            if (enableContextMenu) {
                                                e.preventDefault();
                                                setContextMenu({ x: e.clientX, y: e.clientY, row });
                                            }
                                        }}
                                    >
                                        {renderCell(column, row, rowIndex, columnIndex)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Loading skeleton
    if (loading) {
        return (
            <div className={cn("border rounded-lg bg-card", className)}>
                <div className="p-4 border-b">
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="p-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col border rounded-lg bg-card shadow-sm", className)}>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search all columns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>

                    {enableBulkOperations && selectedRows.size > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {selectedRows.size} selected
                        </Badge>
                    )}

                    {Object.keys(filters).length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters({})}
                            className="text-destructive hover:text-destructive"
                        >
                            <FilterX className="h-4 w-4 mr-1" />
                            Clear Filters ({Object.keys(filters).length})
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {customToolbar}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilterDialog(true)}
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowColumnManager(true)}
                    >
                        <Settings className="h-4 w-4 mr-1" />
                        Columns
                    </Button>

                    {enableExport && (
                        <Select onValueChange={handleExport}>
                            <SelectTrigger className="w-32">
                                <Download className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Export" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">Export CSV</SelectItem>
                                <SelectItem value="excel">Export Excel</SelectItem>
                                <SelectItem value="json">Export JSON</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {enableBulkOperations && selectedRows.size > 0 && (
                        <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                                <Edit2 className="h-4 w-4 mr-1" />
                                Bulk Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete ({selectedRows.size})
                            </Button>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => gridApi.refreshData()}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid Container */}
            <div ref={gridRef} className="flex-1 overflow-hidden relative">
                <div className="flex h-full">
                    {/* Selection Column */}
                    {enableRowSelection && (
                        <div className="flex-shrink-0 w-12 border-r border-border bg-muted/10">
                            {/* Header */}
                            <div
                                className="flex items-center justify-center border-b bg-muted/30"
                                style={{ height: headerHeight }}
                            >
                                {enableMultiSelect && (
                                    <Checkbox
                                        checked={paginatedData.length > 0 && paginatedData.every(row => selectedRows.has(getRowId(row)))}
                                        onCheckedChange={handleSelectAll}
                                    />
                                )}
                            </div>

                            {/* Cells */}
                            <div>
                                {paginatedData.map((row) => {
                                    const rowId = getRowId(row);
                                    return (
                                        <div
                                            key={rowId}
                                            className="flex items-center justify-center border-b border-border/50"
                                            style={{ height: getRowHeight() }}
                                        >
                                            <Checkbox
                                                checked={selectedRows.has(rowId)}
                                                onCheckedChange={(checked) => handleRowSelection(rowId, checked as boolean)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Left Pinned Columns */}
                    {pinnedLeftColumns.length > 0 && (
                        <div className="flex-shrink-0 border-r-2 border-primary/20 bg-muted/5">
                            {renderColumnSection(pinnedLeftColumns)}
                        </div>
                    )}

                    {/* Scrollable Center Columns */}
                    <div className="flex-1 overflow-x-auto" ref={bodyRef}>
                        {renderColumnSection(centerColumns)}
                    </div>

                    {/* Right Pinned Columns */}
                    {pinnedRightColumns.length > 0 && (
                        <div className="flex-shrink-0 border-l-2 border-primary/20 bg-muted/5">
                            {renderColumnSection(pinnedRightColumns)}
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {paginatedData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Data Found</h3>
                            <p className="text-muted-foreground max-w-sm">
                                {searchQuery || Object.keys(filters).length > 0
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'No data available to display'
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with Pagination */}
            {pagination && (
                <div className="flex items-center justify-between p-4 border-t bg-muted/10">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                            Showing {((currentPage - 1) * currentPageSize) + 1} to{' '}
                            {Math.min(currentPage * currentPageSize, processedData.length)} of{' '}
                            {processedData.length} rows
                        </span>
                        {selectedRows.size > 0 && (
                            <span className="text-primary font-medium">
                                • {selectedRows.size} selected
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={String(currentPageSize)}
                            onValueChange={(value) => {
                                setCurrentPageSize(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                                <SelectItem value="200">200</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let page;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="w-8 h-8"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Column Manager Dialog */}
            <Dialog open={showColumnManager} onOpenChange={setShowColumnManager}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Manage Columns</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {columns.map((column) => (
                            <div key={column.id} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={!hiddenColumns.has(column.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setHiddenColumns(prev => {
                                                    const newSet = new Set(prev);
                                                    newSet.delete(column.id);
                                                    return newSet;
                                                });
                                            } else {
                                                setHiddenColumns(prev => new Set([...prev, column.id]));
                                            }
                                        }}
                                    />
                                    <span className="font-medium">{column.title}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={columnWidths[column.id] || column.width || 150}
                                        onChange={(e) => handleColumnResize(column.id, Number(e.target.value))}
                                        className="w-20"
                                        min="50"
                                    />

                                    <Select
                                        value={pinnedColumns[column.id] || 'none'}
                                        onValueChange={(value) => handleColumnPin(column.id, value === 'none' ? false : value as 'left' | 'right')}
                                    >
                                        <SelectTrigger className="w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-background border rounded-lg shadow-lg py-2 min-w-32"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onBlur={() => setContextMenu(null)}
                    tabIndex={-1}
                >
                    <button
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                        onClick={() => {
                            if (contextMenu.row) {
                                navigator.clipboard.writeText(JSON.stringify(contextMenu.row));
                            }
                            setContextMenu(null);
                        }}
                    >
                        <Copy className="h-4 w-4" />
                        Copy Row
                    </button>
                    {enableInlineEditing && (
                        <button
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                            onClick={() => {
                                // Start editing first editable cell
                                const editableColumn = visibleColumns.find(col => col.editable);
                                if (editableColumn && contextMenu.row) {
                                    setEditingCell({
                                        rowId: getRowId(contextMenu.row),
                                        field: editableColumn.field
                                    });
                                    setEditValue(contextMenu.row[editableColumn.field]);
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Row
                        </button>
                    )}
                    <Separator className="my-1" />
                    <button
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center gap-2"
                        onClick={() => {
                            if (contextMenu.row) {
                                gridApi.removeRow(getRowId(contextMenu.row));
                            }
                            setContextMenu(null);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Row
                    </button>
                </div>
            )}

            {/* Custom Footer */}
            {customFooter}
        </div>
    );
};

export default DataGrid;
