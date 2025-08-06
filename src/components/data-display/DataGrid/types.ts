
// Types for Bento Grid DataGrid
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

// Bento Grid specific types
type ViewMode = 'grid' | 'compact' | 'cards';
type GridSize = 'small' | 'medium' | 'large';
type DensityMode = 'compact' | 'standard' | 'comfortable';

interface DataGridProps<T = any> {
    data: T[];
    columns: GridColumn<T>[];
    loading?: boolean;
    rowHeight?: number;
    headerHeight?: number;
    // Bento grid features
    enableRowSelection?: boolean;
    enableMultiSelect?: boolean;
    enableInlineEditing?: boolean;
    enableBulkOperations?: boolean;
    enableExport?: boolean;
    enableAggregation?: boolean;
    enableContextMenu?: boolean;
    enableUndoRedo?: boolean;
    // Layout options
    viewMode?: ViewMode;
    gridSize?: GridSize;
    pageSize?: number;
    pagination?: boolean;
    serverSide?: boolean;
    totalCount?: number;
    className?: string;
    density?: DensityMode;
    // Event handlers
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
    onViewModeChange?: (mode: ViewMode) => void;
    onGridSizeChange?: (size: GridSize) => void;
    // Custom components
    customToolbar?: React.ReactNode;
    customFooter?: React.ReactNode;
    customCardRenderer?: (item: T, index: number) => React.ReactNode;
    customEmptyState?: React.ReactNode;
}

// Animation variants for framer-motion
interface AnimationVariants {
    hidden: any;
    visible: any;
    hover?: any;
    selected?: any;
    exit?: any;
}

// Context menu item interface
interface ContextMenuItem {
    id: string;
    label: string;
    icon?: React.ComponentType;
    action: (item: any) => void;
    separator?: boolean;
    disabled?: boolean;
    destructive?: boolean;
}

// Filter panel configuration
interface FilterPanelConfig {
    showQuickFilters?: boolean;
    showAdvancedFilters?: boolean;
    quickFilterColumns?: string[];
    customFilters?: CustomFilter[];
}

interface CustomFilter {
    id: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'range';
    options?: { label: string; value: any }[];
    apply: (data: any[], value: any) => any[];
}

// Export configuration
interface ExportConfig {
    formats: ('csv' | 'excel' | 'json' | 'pdf')[];
    includeFiltered?: boolean;
    includeSelected?: boolean;
    customFormatter?: (data: any[]) => any;
}

// Bulk operation configuration
interface BulkOperation {
    id: string;
    label: string;
    icon?: React.ComponentType;
    action: (items: any[]) => Promise<void> | void;
    confirmMessage?: string;
    destructive?: boolean;
}

// Advanced grid configuration
interface GridConfig {
    virtualScrolling?: boolean;
    infiniteScroll?: boolean;
    autoSave?: boolean;
    autoRefresh?: number; // seconds
    keyboardNavigation?: boolean;
    accessibility?: boolean;
    theme?: 'auto' | 'light' | 'dark';
    animations?: boolean;
    persistState?: boolean;
    stateKey?: string;
}

// Search and filtering
interface SearchConfig {
    placeholder?: string;
    searchableFields?: string[];
    highlightMatches?: boolean;
    fuzzySearch?: boolean;
    searchDelay?: number;
}

// Performance monitoring
interface PerformanceMetrics {
    renderTime: number;
    dataProcessingTime: number;
    itemCount: number;
    visibleItems: number;
    scrollPosition: number;
}

export type {
    DataGridProps,
    GridColumn,
    CellRendererParams,
    GridApi,
    ColumnState,
    FilterConfig,
    SortConfig,
    ViewMode,
    GridSize,
    DensityMode,
    AnimationVariants,
    ContextMenuItem,
    FilterPanelConfig,
    CustomFilter,
    ExportConfig,
    BulkOperation,
    GridConfig,
    SearchConfig,
    PerformanceMetrics
};
