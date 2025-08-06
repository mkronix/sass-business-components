
export interface GridColumn<T = any> {
  id: string;
  field: string;
  title: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  visible?: boolean;
  pinned?: 'left' | 'right';
  cellRenderer?: (params: CellRendererParams<T>) => React.ReactNode;
  headerRenderer?: () => React.ReactNode;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom' | 'select';
  format?: string;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  valueGetter?: (row: T) => any;
  valueSetter?: (row: T, value: any) => T;
  options?: Array<{ label: string; value: any }>;
}

export interface CellRendererParams<T = any> {
  value: any;
  row: T;
  column: GridColumn<T>;
  rowIndex: number;
  api: GridApi<T>;
  setValue: (value: any) => void;
  startEditing: () => void;
  stopEditing: () => void;
}

export interface GridApi<T = any> {
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

export interface ColumnState {
  id: string;
  width: number;
  visible: boolean;
  order: number;
  pinned?: 'left' | 'right';
}

export interface FilterConfig {
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value2?: any;
}

export interface SortConfig {
  columnId: string;
  direction: 'asc' | 'desc';
  priority: number;
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: GridColumn<T>[];
  loading?: boolean;
  enableRowSelection?: boolean;
  enableMultiSelect?: boolean;
  enableInlineEditing?: boolean;
  enableBulkOperations?: boolean;
  enableExport?: boolean;
  enableContextMenu?: boolean;
  pageSize?: number;
  pagination?: boolean;
  className?: string;
  density?: 'compact' | 'standard' | 'comfortable';
  getRowId?: (row: T) => string | number;
  onRowClick?: (row: T, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: T, event: React.MouseEvent) => void;
  onCellEdit?: (rowId: string | number, field: string, value: any, oldValue?: any) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  customToolbar?: React.ReactNode;
  customFooter?: React.ReactNode;
}

// Additional types needed by index.ts
export type ViewMode = 'grid' | 'compact' | 'cards';
export type GridSize = 'small' | 'medium' | 'large';
export type DensityMode = 'compact' | 'standard' | 'comfortable';

export interface AnimationVariants {
  hidden: any;
  visible: any;
  hover?: any;
  selected?: any;
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface FilterPanelConfig {
  enabled: boolean;
  position: 'left' | 'right' | 'bottom';
  width?: number;
  height?: number;
}

export interface CustomFilter {
  id: string;
  field: string;
  type: 'text' | 'number' | 'date' | 'select';
  label: string;
  options?: Array<{ label: string; value: any }>;
}

export interface ExportConfig {
  csv?: boolean;
  excel?: boolean;
  json?: boolean;
  pdf?: boolean;
}

export interface BulkOperation {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (selectedItems: any[]) => void;
  confirmMessage?: string;
}

export interface GridConfig {
  showHeaders?: boolean;
  showPagination?: boolean;
  showToolbar?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  autoHeight?: boolean;
  stickyHeaders?: boolean;
}

export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  debounceMs?: number;
  searchFields?: string[];
}

export interface PerformanceMetrics {
  renderTime?: number;
  itemCount?: number;
  visibleItems?: number;
  scrollPosition?: number;
  lastUpdate?: number;
}
