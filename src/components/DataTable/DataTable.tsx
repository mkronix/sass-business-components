
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTableProps, FilterValue, SortValue } from './types';

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  sortable = true,
  filterable = true,
  selectable = false,
  multiSelect = false,
  editable = false,
  exportable = false,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onRowSelect,
  onRowEdit,
  onExport,
  emptyMessage = "No data available",
  className
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [sorts, setSorts] = useState<SortValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(col =>
          String(row[col.accessorKey] || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.column];
        if (filter.operator === 'contains') {
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        }
        return value === filter.value;
      });
    });

    // Apply sorts
    sorts.forEach(sort => {
      result.sort((a, b) => {
        const aValue = a[sort.column];
        const bValue = b[sort.column];

        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    });

    return result;
  }, [data, searchQuery, filters, sorts, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / currentPageSize);
  const paginatedData = pagination
    ? filteredAndSortedData.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    : filteredAndSortedData;

  const handleSort = (columnId: string) => {
    if (!sortable) return;

    setSorts(prev => {
      const existingSort = prev.find(s => s.column === columnId);
      if (existingSort) {
        if (existingSort.direction === 'asc') {
          return prev.map(s => s.column === columnId ? { ...s, direction: 'desc' as const } : s);
        } else {
          return prev.filter(s => s.column !== columnId);
        }
      } else {
        return [...prev, { column: columnId, direction: 'asc' as const }];
      }
    });
  };

  const handleFilter = (columnId: string, value: any) => {
    setFilters(prev => {
      const existingFilter = prev.find(f => f.column === columnId);
      if (existingFilter) {
        if (value === '' || value === null) {
          return prev.filter(f => f.column !== columnId);
        }
        return prev.map(f => f.column === columnId ? { ...f, value } : f);
      } else {
        return [...prev, { column: columnId, value, operator: 'contains' as const }];
      }
    });
  };

  const handleRowSelect = (row: T) => {
    if (!selectable) return;

    setSelectedRows(prev => {
      if (multiSelect) {
        const isSelected = prev.some(r => JSON.stringify(r) === JSON.stringify(row));
        const newSelection = isSelected
          ? prev.filter(r => JSON.stringify(r) !== JSON.stringify(row))
          : [...prev, row];
        onRowSelect?.(newSelection);
        return newSelection;
      } else {
        const newSelection = [row];
        onRowSelect?.(newSelection);
        return newSelection;
      }
    });
  };

  const handleSelectAll = () => {
    if (!selectable || !multiSelect) return;

    const allSelected = selectedRows.length === paginatedData.length;
    const newSelection = allSelected ? [] : [...paginatedData];
    setSelectedRows(newSelection);
    onRowSelect?.(newSelection);
  };

  const handleEdit = (rowIndex: number, columnId: string, currentValue: any) => {
    if (!editable) return;
    setEditingCell({ rowIndex, columnId });
    setEditValue(String(currentValue || ''));
  };

  const handleSaveEdit = () => {
    if (editingCell && onRowEdit) {
      const row = paginatedData[editingCell.rowIndex];
      onRowEdit(row, editingCell.columnId, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const isRowSelected = (row: T) => {
    return selectedRows.some(r => JSON.stringify(r) === JSON.stringify(row));
  };

  const getSortIcon = (columnId: string) => {
    const sort = sorts.find(s => s.column === columnId);
    if (!sort) return <ArrowUpDown className="h-4 w-4" />;
    return sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="h-12 bg-muted animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 animate-pulse border-t" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 ", className)}>
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}

          {filterable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {filters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {exportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport?.('csv')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}

          {pagination && (
            <Select value={String(currentPageSize)} onValueChange={(value) => setCurrentPageSize(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && filterable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.filter(col => col.filterable).map(column => (
                <div key={column.id} className="space-y-2">
                  <label className="text-sm font-medium">{column.header}</label>
                  <Input
                    placeholder={`Filter ${column.header}...`}
                    value={filters.find(f => f.column === column.accessorKey)?.value || ''}
                    onChange={(e) => handleFilter(column.accessorKey, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="w-12 p-4">
                    {multiSelect && (
                      <Checkbox
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    )}
                  </th>
                )}
                {columns.map(column => (
                  <th
                    key={column.id}
                    className={cn(
                      "p-4 text-left font-medium",
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      sortable && column.sortable !== false && 'cursor-pointer hover:bg-muted/70'
                    )}
                    onClick={() => column.sortable !== false && handleSort(column.accessorKey)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {sortable && column.sortable !== false && getSortIcon(column.accessorKey)}
                    </div>
                  </th>
                ))}
                {editable && <th className="w-12 p-4"></th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (editable ? 1 : 0)} className="p-8 text-center text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={cn(
                    "border-t hover:bg-muted/50 transition-colors",
                    isRowSelected(row) && "bg-muted/50"
                  )}>
                    {selectable && (
                      <td className="p-4">
                        <Checkbox
                          checked={isRowSelected(row)}
                          onCheckedChange={() => handleRowSelect(row)}
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.id}
                        className={cn(
                          "p-4",
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {editingCell?.rowIndex === rowIndex && editingCell?.columnId === column.accessorKey ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                            />
                            <Button size="sm" variant="outline" onClick={handleSaveEdit}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              editable && "cursor-pointer hover:bg-muted/50 rounded px-2 py-1"
                            )}
                            onClick={() => editable && handleEdit(rowIndex, column.accessorKey, row[column.accessorKey])}
                          >
                            {column.cell ? column.cell(row[column.accessorKey], row) : String(row[column.accessorKey] || '')}
                          </div>
                        )}
                      </td>
                    ))}
                    {editable && (
                      <td className="p-4">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(rowIndex, columns[0].accessorKey, row[columns[0].accessorKey])}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedData.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {emptyMessage}
            </CardContent>
          </Card>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <Card key={rowIndex} className={cn(
              "transition-colors",
              isRowSelected(row) && "bg-muted/50"
            )}>
              <CardContent className="p-4">
                {selectable && (
                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                      checked={isRowSelected(row)}
                      onCheckedChange={() => handleRowSelect(row)}
                    />
                    <span className="text-sm font-medium">Select</span>
                  </div>
                )}
                <div className="space-y-3">
                  {columns.map(column => (
                    <div key={column.id} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.header}:
                      </span>
                      <span className="text-sm text-right max-w-[60%]">
                        {column.cell ? column.cell(row[column.accessorKey], row) : String(row[column.accessorKey] || '')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * currentPageSize) + 1} to {Math.min(currentPage * currentPageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8"
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
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
          <span className="text-sm font-medium">
            {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRows([])}
          >
            Clear selection
          </Button>
        </div>
      )}
    </div>
  );
};
