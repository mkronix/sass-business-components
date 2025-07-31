
export interface Column<T = any> {
  id: string;
  header: string;
  accessorKey: string;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { label: string; value: string }[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  editable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowSelect?: (rows: T[]) => void;
  onRowEdit?: (row: T, field: string, value: any) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  emptyMessage?: string;
  className?: string;
}

export interface FilterValue {
  column: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'between';
}

export interface SortValue {
  column: string;
  direction: 'asc' | 'desc';
}
