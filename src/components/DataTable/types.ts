import { ReactNode } from 'react';

/**
 * Enhanced Column Configuration
 */
export interface Column<T = any> {
  /** Unique identifier for the column */
  id: string;

  /** Display header text */
  header: string;

  /** Key to access data from row object */
  accessorKey: string;

  /** Custom cell renderer function */
  cell?: (value: any, row: T, index: number) => ReactNode;

  /** Enable/disable sorting for this column */
  sortable?: boolean;

  /** Enable/disable filtering for this column */
  filterable?: boolean;

  /** Type of filter to show */
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean';

  /** Options for select filter type */
  filterOptions?: FilterOption[];

  /** Fixed width (CSS value like '200px' or '20%') */
  width?: string;

  /** Minimum width (CSS value) */
  minWidth?: string;

  /** Maximum width (CSS value) */
  maxWidth?: string;

  /** Text alignment */
  align?: 'left' | 'center' | 'right';

  /** Make column sticky to left side */
  sticky?: boolean;

  /** Enable column resizing */
  resizable?: boolean;

  /** Hide column by default */
  hidden?: boolean;

  /** Custom header renderer */
  headerCell?: () => ReactNode;

  /** Footer content for the column */
  footer?: string | ReactNode;

  /** CSS class for column cells */
  className?: string;

  /** CSS class for header cell */
  headerClassName?: string;
}

/**
 * Filter Option for Select Filters
 */
export interface FilterOption {
  label: string;
  value: string | number | boolean;
  icon?: ReactNode;
}

/**
 * Filter Value Configuration
 */
export interface FilterValue {
  /** Column identifier */
  column: string;

  /** Filter value */
  value: any;

  /** Filter operator */
  operator?: FilterOperator;

  /** Label for complex filters */
  label?: string;
}

/**
 * Filter Operators
 */
export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

/**
 * Sort Configuration
 */
export interface SortValue {
  /** Column identifier */
  column: string;

  /** Sort direction */
  direction: 'asc' | 'desc';

  /** Priority for multi-column sorting */
  priority?: number;
}

/**
 * Export Format Options
 */
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

/**
 * Table Density Options
 */
export type TableDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Selection Mode
 */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * Main DataTable Props
 */
export interface DataTableProps<T = any> {
  /** Array of data to display */
  data: T[];

  /** Column configuration */
  columns: Column<T>[];

  /** Loading state */
  loading?: boolean;

  /** Enable global search */
  searchable?: boolean;

  /** Enable column sorting */
  sortable?: boolean;

  /** Enable column filtering */
  filterable?: boolean;

  /** Enable row selection */
  selectable?: boolean;

  /** Allow multiple row selection */
  multiSelect?: boolean;

  /** Enable inline editing */
  editable?: boolean;

  /** Enable export functionality */
  exportable?: boolean;

  /** Enable pagination */
  pagination?: boolean;

  /** Default page size */
  pageSize?: number;

  /** Available page size options */
  pageSizeOptions?: number[];

  /** Callback when rows are selected */
  onRowSelect?: (rows: T[]) => void;

  /** Callback when cell is edited */
  onRowEdit?: (row: T, field: string, value: any) => void;

  /** Callback for export action */
  onExport?: (format: ExportFormat, data: T[]) => void;

  /** Callback for refresh action */
  onRefresh?: () => void;

  /** Callback when sorting changes */
  onSortChange?: (sorts: SortValue[]) => void;

  /** Callback when filters change */
  onFilterChange?: (filters: FilterValue[]) => void;

  /** Callback when page changes */
  onPageChange?: (page: number, pageSize: number) => void;

  /** Message to show when no data */
  emptyMessage?: string;

  /** Additional CSS classes */
  className?: string;

  /** Global action buttons */
  globalActions?: ReactNode;

  /** Row-specific action buttons */
  rowActions?: (row: T, index: number) => ReactNode;

  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean;

  /** Enable density control */
  enableDensity?: boolean;

  /** Make header sticky */
  stickyHeader?: boolean;

  /** Enable virtualization for large datasets */
  virtualized?: boolean;

  /** Alternate row colors */
  zebra?: boolean;

  /** Show table borders */
  bordered?: boolean;

  /** Compact layout */
  compact?: boolean;

  /** Enable column resizing */
  resizable?: boolean;

  /** Custom empty state component */
  emptyStateComponent?: ReactNode;

  /** Custom loading component */
  loadingComponent?: ReactNode;

  /** Maximum height for table container */
  maxHeight?: string;

  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;

  /** Server-side pagination */
  serverSide?: boolean;

  /** Total count for server-side pagination */
  totalCount?: number;

  /** Custom row className function */
  rowClassName?: (row: T, index: number) => string;

  /** Custom cell className function */
  cellClassName?: (value: any, row: T, column: Column<T>) => string;
}

/**
 * Table State Management
 */
export interface TableState<T = any> {
  /** Current page */
  currentPage: number;

  /** Current page size */
  pageSize: number;

  /** Search query */
  searchQuery: string;

  /** Active filters */
  filters: FilterValue[];

  /** Active sorts */
  sorts: SortValue[];

  /** Selected rows */
  selectedRows: T[];

  /** Hidden columns */
  hiddenColumns: string[];

  /** Table density */
  density: TableDensity;

  /** Column widths */
  columnWidths: Record<string, number>;

  /** Currently editing cell */
  editingCell: { rowIndex: number; columnId: string } | null;
}

/**
 * Table Actions
 */
export interface TableActions<T = any> {
  /** Set current page */
  setPage: (page: number) => void;

  /** Set page size */
  setPageSize: (size: number) => void;

  /** Set search query */
  setSearch: (query: string) => void;

  /** Add or update filter */
  setFilter: (column: string, value: any, operator?: FilterOperator) => void;

  /** Remove filter */
  removeFilter: (column: string) => void;

  /** Clear all filters */
  clearFilters: () => void;

  /** Toggle sort */
  toggleSort: (column: string) => void;

  /** Set sort */
  setSort: (column: string, direction: 'asc' | 'desc') => void;

  /** Clear all sorts */
  clearSorts: () => void;

  /** Select rows */
  selectRows: (rows: T[]) => void;

  /** Toggle row selection */
  toggleRowSelection: (row: T) => void;

  /** Select all rows */
  selectAll: () => void;

  /** Clear selection */
  clearSelection: () => void;

  /** Toggle column visibility */
  toggleColumn: (columnId: string) => void;

  /** Set table density */
  setDensity: (density: TableDensity) => void;

  /** Reset table state */
  reset: () => void;
}

/**
 * Column Sorting Configuration
 */
export interface ColumnSort {
  /** Column ID */
  id: string;

  /** Sort direction */
  desc: boolean;
}

/**
 * Pagination Info
 */
export interface PaginationState {
  /** Current page index (0-based) */
  pageIndex: number;

  /** Current page size */
  pageSize: number;

  /** Total number of pages */
  pageCount?: number;

  /** Total number of rows */
  totalRows?: number;
}

/**
 * Row Selection State
 */
export interface RowSelectionState {
  /** Map of selected row IDs */
  [key: string]: boolean;
}

/**
 * Column Visibility State
 */
export interface ColumnVisibilityState {
  /** Map of column visibility */
  [key: string]: boolean;
}

/**
 * Filter Function Type
 */
export type FilterFn<T = any> = (
  row: T,
  columnId: string,
  filterValue: any
) => boolean;

/**
 * Sort Function Type
 */
export type SortFn<T = any> = (
  rowA: T,
  rowB: T,
  columnId: string
) => number;

/**
 * Custom Hook Return Type
 */
export interface UseDataTableReturn<T = any> {
  /** Table state */
  state: TableState<T>;

  /** Table actions */
  actions: TableActions<T>;

  /** Processed data */
  processedData: T[];

  /** Pagination info */
  pagination: PaginationState;

  /** Selection info */
  selection: {
    selectedRows: T[];
    isAllSelected: boolean;
    isSomeSelected: boolean;
  };
}

/**
 * Export Options
 */
export interface ExportOptions {
  /** File name */
  filename?: string;

  /** Include headers */
  includeHeaders?: boolean;

  /** Selected columns only */
  selectedColumnsOnly?: boolean;

  /** Custom column headers */
  customHeaders?: Record<string, string>;

  /** Date format for date columns */
  dateFormat?: string;

  /** Number format for numeric columns */
  numberFormat?: Intl.NumberFormatOptions;
}

/**
 * Advanced Filter Configuration
 */
export interface AdvancedFilter {
  /** Filter ID */
  id: string;

  /** Filter label */
  label: string;

  /** Column to filter */
  column: string;

  /** Filter operator */
  operator: FilterOperator;

  /** Filter value */
  value: any;

  /** Additional filter value for range filters */
  value2?: any;

  /** Filter group */
  group?: string;

  /** Logic operator for multiple filters */
  logic?: 'AND' | 'OR';
}

/**
 * Bulk Action Configuration
 */
export interface BulkAction<T = any> {
  /** Action ID */
  id: string;

  /** Action label */
  label: string;

  /** Action icon */
  icon?: ReactNode;

  /** Action handler */
  handler: (selectedRows: T[]) => void | Promise<void>;

  /** Confirmation message */
  confirmMessage?: string;

  /** Action variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';

  /** Disabled condition */
  disabled?: (selectedRows: T[]) => boolean;
}

/**
 * Column Group Configuration
 */
export interface ColumnGroup {
  /** Group ID */
  id: string;

  /** Group header */
  header: string;

  /** Columns in this group */
  columns: string[];

  /** Group span */
  span?: number;

  /** Group alignment */
  align?: 'left' | 'center' | 'right';
}

/**
 * Table Theme Configuration
 */
export interface TableTheme {
  /** Color scheme */
  colorScheme?: 'light' | 'dark' | 'auto';

  /** Primary color */
  primaryColor?: string;

  /** Border radius */
  borderRadius?: string;

  /** Font family */
  fontFamily?: string;

  /** Custom CSS variables */
  variables?: Record<string, string>;
}

/**
 * Validation Rule
 */
export interface ValidationRule {
  /** Rule type */
  type: 'required' | 'email' | 'number' | 'min' | 'max' | 'pattern' | 'custom';

  /** Rule value */
  value?: any;

  /** Error message */
  message: string;

  /** Custom validator function */
  validator?: (value: any) => boolean;
}

/**
 * Editable Cell Configuration
 */
export interface EditableCell {
  /** Cell type */
  type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'textarea';

  /** Options for select type */
  options?: FilterOption[];

  /** Validation rules */
  validation?: ValidationRule[];

  /** Placeholder text */
  placeholder?: string;

  /** Disabled condition */
  disabled?: boolean;

  /** Read-only condition */
  readOnly?: boolean;
}

/**
 * Table Plugin Configuration
 */
export interface TablePlugin<T = any> {
  /** Plugin name */
  name: string;

  /** Plugin version */
  version: string;

  /** Plugin initialization */
  init: (table: any) => void;

  /** Plugin cleanup */
  destroy?: () => void;

  /** Plugin options */
  options?: Record<string, any>;
}

/**
 * Performance Options
 */
export interface PerformanceOptions {
  /** Enable virtualization */
  virtualization?: boolean;

  /** Virtual item height */
  virtualItemHeight?: number;

  /** Debounce delay for search */
  searchDebounce?: number;

  /** Throttle delay for scroll */
  scrollThrottle?: number;

  /** Lazy loading threshold */
  lazyLoadThreshold?: number;
}