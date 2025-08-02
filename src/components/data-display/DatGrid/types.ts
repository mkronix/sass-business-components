
// Types
interface GridColumn<T = any> {
    id: string;
    field: string;
    title: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    resizable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    editable?: boolean;
    pinned?: 'left' | 'right' | false;
    hidden?: boolean;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'custom';
    align?: 'left' | 'center' | 'right';
    format?: (value: any) => string;
    cellRenderer?: (params: CellRendererParams<T>) => React.ReactNode;
    headerRenderer?: () => React.ReactNode;
    validator?: (value: any) => string | null;
    options?: { label: string; value: any }[];
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'custom';
    aggregationFunction?: (values: any[]) => any;
}

interface CellRendererParams<T = any> {
    value: any;
    row: T;
    column: GridColumn<T>;
    rowIndex: number;
    columnIndex: number;
    isEditing: boolean;
    startEdit: () => void;
    stopEdit: () => void;
    api: GridApi<T>;
}

interface GridApi<T = any> {
    refreshData: () => void;
    exportData: (format: 'csv' | 'excel' | 'json') => void;
    selectAll: () => void;
    clearSelection: () => void;
    getSelectedRows: () => T[];
    addRow: (row: T) => void;
    removeRow: (id: string | number) => void;
    updateRow: (id: string | number, updates: Partial<T>) => void;
    getColumnState: () => ColumnState[];
    setColumnState: (state: ColumnState[]) => void;
    applyFilter: (columnId: string, filter: FilterConfig) => void;
    clearFilters: () => void;
    setSorting: (sorting: SortConfig[]) => void;
    autoSizeColumns: () => void;
    exportToPDF: () => void;
}

interface ColumnState {
    id: string;
    width: number;
    pinned: 'left' | 'right' | false;
    hidden: boolean;
    order: number;
}

interface FilterConfig {
    type: 'text' | 'number' | 'date' | 'select' | 'range';
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
    value: any;
    value2?: any; // For range filters
}

interface SortConfig {
    columnId: string;
    direction: 'asc' | 'desc';
    priority: number;
}

interface DataGridProps<T = any> {
    data: T[];
    columns: GridColumn<T>[];
    loading?: boolean;
    rowHeight?: number;
    headerHeight?: number;
    enableVirtualScrolling?: boolean;
    enableColumnResize?: boolean;
    enableColumnReorder?: boolean;
    enableColumnPinning?: boolean;
    enableRowSelection?: boolean;
    enableMultiSelect?: boolean;
    enableInlineEditing?: boolean;
    enableBulkOperations?: boolean;
    enableExport?: boolean;
    enableAggregation?: boolean;
    enableContextMenu?: boolean;
    enableUndoRedo?: boolean;
    pageSize?: number;
    pagination?: boolean;
    serverSide?: boolean;
    totalCount?: number;
    className?: string;
    theme?: 'light' | 'dark' | 'auto';
    density?: 'compact' | 'standard' | 'comfortable';
    getRowId?: (row: T) => string | number;
    onRowClick?: (row: T, event: React.MouseEvent) => void;
    onRowDoubleClick?: (row: T, event: React.MouseEvent) => void;
    onCellClick?: (params: CellRendererParams<T>, event: React.MouseEvent) => void;
    onCellEdit?: (rowId: string | number, field: string, newValue: any, oldValue: any) => Promise<boolean> | boolean;
    onSelectionChange?: (selectedRows: T[]) => void;
    onSortChange?: (sorting: SortConfig[]) => void;
    onFilterChange?: (filters: Record<string, FilterConfig>) => void;
    onColumnStateChange?: (state: ColumnState[]) => void;
    onPageChange?: (page: number, pageSize: number) => void;
    customToolbar?: React.ReactNode;
    customFooter?: React.ReactNode;
}

export type { DataGridProps, GridColumn, CellRendererParams, GridApi, ColumnState, FilterConfig, SortConfig };