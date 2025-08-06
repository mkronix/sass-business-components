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
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: string;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  valueGetter?: (row: T) => any;
  valueSetter?: (row: T, value: any) => T;
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
  onCellEdit?: (rowId: string | number, field: string, value: any) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  customToolbar?: React.ReactNode;
  customFooter?: React.ReactNode;
}