
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ArrowUpDown,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Filter,
  FilterX,
  Hash,
  RefreshCw,
  Search,
  Settings,
  SortAsc,
  SortDesc,
  Type,
  X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableProps, FilterValue, SortValue } from './types';

const DataTable = <T extends Record<string, any>>({
  data = [],
  columns: initialColumns = [],
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
  pageSizeOptions = [5, 10, 25, 50, 100],
  onRowSelect,
  onRowEdit,
  onExport,
  onRefresh,
  emptyMessage = "No data available",
  className,
  globalActions,
  rowActions,
  enableColumnVisibility = true,
  enableDensity = true,
  stickyHeader = false,
  virtualized = false,
  zebra = true,
  bordered = true,
  compact = false
}: DataTableProps<T>) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [sorts, setSorts] = useState<SortValue[]>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [density, setDensity] = useState<'compact' | 'normal' | 'comfortable'>('normal');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Computed columns with visibility - safely handle undefined initialColumns
  const visibleColumns = useMemo(() => {
    if (!initialColumns || !Array.isArray(initialColumns)) return [];
    return initialColumns.filter(col => !hiddenColumns.includes(col.id) && !col.hidden);
  }, [initialColumns, hiddenColumns]);

  // Enhanced search with debouncing
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Advanced filtering and sorting - safely handle undefined data
  const filteredAndSortedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let result = [...data];

    // Apply global search
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(row =>
        visibleColumns.some(col => {
          const value = row[col.accessorKey];
          return String(value || '').toLowerCase().includes(query);
        })
      );
    }

    // Apply column filters
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = row[filter.column];
        const filterValue = filter.value;

        if (filterValue === '' || filterValue === null || filterValue === undefined) {
          return true;
        }

        switch (filter.operator) {
          case 'equals':
            return value === filterValue;
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          case 'gt':
            return Number(value) > Number(filterValue);
          case 'lt':
            return Number(value) < Number(filterValue);
          case 'gte':
            return Number(value) >= Number(filterValue);
          case 'lte':
            return Number(value) <= Number(filterValue);
          default:
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        }
      });
    });

    // Apply sorting
    if (sorts.length > 0) {
      result.sort((a, b) => {
        for (const sort of sorts) {
          const aValue = a[sort.column];
          const bValue = b[sort.column];

          // Handle null/undefined values
          if (aValue == null && bValue == null) continue;
          if (aValue == null) return sort.direction === 'asc' ? 1 : -1;
          if (bValue == null) return sort.direction === 'asc' ? -1 : 1;

          // Handle different data types
          let comparison = 0;
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
  }, [data, debouncedSearchQuery, filters, sorts, visibleColumns]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData.length / currentPageSize);
  const paginatedData = pagination
    ? filteredAndSortedData.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    : filteredAndSortedData;

  // Event handlers
  const handleSort = useCallback((columnId: string) => {
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
  }, [sortable]);

  const handleFilter = useCallback((columnId: string, value: any, operator: FilterValue['operator'] = 'contains') => {
    setFilters(prev => {
      const existingFilter = prev.find(f => f.column === columnId);
      if (existingFilter) {
        if (value === '' || value === null || value === undefined) {
          return prev.filter(f => f.column !== columnId);
        }
        return prev.map(f => f.column === columnId ? { ...f, value, operator } : f);
      } else {
        if (value === '' || value === null || value === undefined) {
          return prev;
        }
        return [...prev, { column: columnId, value, operator }];
      }
    });
  }, []);

  const handleRowSelect = useCallback((row: T) => {
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
  }, [selectable, multiSelect, onRowSelect]);

  const handleSelectAll = useCallback(() => {
    if (!selectable || !multiSelect) return;

    const allSelected = selectedRows.length === paginatedData.length && paginatedData.length > 0;
    const newSelection = allSelected ? [] : [...paginatedData];
    setSelectedRows(newSelection);
    onRowSelect?.(newSelection);
  }, [selectable, multiSelect, selectedRows.length, paginatedData, onRowSelect]);

  const clearAllFilters = useCallback(() => {
    setFilters([]);
    setSearchQuery('');
  }, []);

  const handleExport = useCallback((format: 'csv' | 'excel' | 'pdf') => {
    onExport?.(format, selectedRows.length > 0 ? selectedRows : filteredAndSortedData);
  }, [onExport, selectedRows, filteredAndSortedData]);

  // Utility functions
  const isRowSelected = useCallback((row: T) => {
    return selectedRows.some(r => JSON.stringify(r) === JSON.stringify(row));
  }, [selectedRows]);

  const getSortIcon = useCallback((columnId: string) => {
    const sort = sorts.find(s => s.column === columnId);
    if (!sort) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sort.direction === 'asc' ?
      <SortAsc className="h-4 w-4 text-primary" /> :
      <SortDesc className="h-4 w-4 text-primary" />;
  }, [sorts]);

  const getFilterIcon = useCallback((columnId: string) => {
    const hasFilter = filters.some(f => f.column === columnId);
    return hasFilter ?
      <Filter className="h-3 w-3 text-primary" /> :
      <Filter className="h-3 w-3 opacity-50" />;
  }, [filters]);

  const getDensityClasses = useCallback(() => {
    switch (density) {
      case 'compact':
        return 'text-xs';
      case 'comfortable':
        return 'text-base';
      default:
        return 'text-sm';
    }
  }, [density]);

  const getCellPadding = useCallback(() => {
    switch (density) {
      case 'compact':
        return 'p-2';
      case 'comfortable':
        return 'p-6';
      default:
        return 'p-4';
    }
  }, [density]);

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card className={cn(bordered && "border")}>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="bg-muted/30 p-4 border-b">
                <div className="flex gap-4">
                  {visibleColumns.map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                  ))}
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border-b border-border/50">
                  <div className="flex gap-4">
                    {visibleColumns.map((_, j) => (
                      <Skeleton key={j} className="h-6 flex-1" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {filterable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {filters.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {filters.length}
                  </Badge>
                )}
              </Button>
            )}

            {filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <FilterX className="h-4 w-4" />
                Clear
              </Button>
            )}

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {globalActions}

          {enableColumnVisibility && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}

          {enableDensity && (
            <Select value={density} onValueChange={(value: any) => setDensity(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
              </SelectContent>
            </Select>
          )}

          {exportable && (
            <Select onValueChange={handleExport}>
              <SelectTrigger className="w-max">
                <Download className="h-4 w-4 mr-2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">Export CSV</SelectItem>
                <SelectItem value="excel">Export Excel</SelectItem>
                <SelectItem value="pdf">Export PDF</SelectItem>
              </SelectContent>
            </Select>
          )}

          {pagination && (
            <Select
              value={String(currentPageSize)}
              onValueChange={(value) => {
                setCurrentPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-14">
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

      {/* Column Settings Panel */}
      {showColumnSettings && enableColumnVisibility && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Column Visibility
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowColumnSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {initialColumns.map(column => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={!hiddenColumns.includes(column.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setHiddenColumns(prev => prev.filter(id => id !== column.id));
                      } else {
                        setHiddenColumns(prev => [...prev, column.id]);
                      }
                    }}
                  />
                  <label
                    htmlFor={column.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.header}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && filterable && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Advanced Filters
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleColumns.filter(col => col.filterable !== false).map(column => {
                const currentFilter = filters.find(f => f.column === column.accessorKey);

                return (
                  <div key={column.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {column.filterType === 'text' && <Type className="h-3 w-3" />}
                      {column.filterType === 'number' && <Hash className="h-3 w-3" />}
                      {column.filterType === 'date' && <Calendar className="h-3 w-3" />}
                      <label className="text-sm font-medium">{column.header}</label>
                      {currentFilter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFilter(column.accessorKey, '')}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {column.filterType === 'select' && column.filterOptions ? (
                      <Select
                        value={currentFilter?.value || ''}
                        onValueChange={(value) => handleFilter(column.accessorKey, value, 'equals')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Filter ${column.header}...`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          {column.filterOptions.map(option => (
                            <SelectItem key={String(option.value)} value={String(option.value)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder={`Filter ${column.header}...`}
                        value={currentFilter?.value || ''}
                        onChange={(e) => handleFilter(column.accessorKey, e.target.value)}
                        type={column.filterType === 'number' ? 'number' :
                          column.filterType === 'date' ? 'date' : 'text'}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      <Card className={cn(bordered && "border", "overflow-hidden")}>
        <div className="overflow-x-auto">
          <table className={cn("w-full", getDensityClasses())}>
            <thead className={cn(
              "bg-muted/30 border-b",
              stickyHeader && "sticky top-0 z-10"
            )}>
              <tr>
                {selectable && (
                  <th className={cn("w-12", getCellPadding())}>
                    {multiSelect && (
                      <Checkbox
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    )}
                  </th>
                )}

                {visibleColumns.map(column => (
                  <th
                    key={column.id}
                    className={cn(
                      getCellPadding(),
                      "text-left font-semibold text-muted-foreground",
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      sortable && column.sortable !== false && 'cursor-pointer hover:bg-muted/50 transition-colors',
                      column.sticky && 'sticky left-0 bg-background'
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth
                    }}
                    onClick={() => column.sortable !== false && handleSort(column.accessorKey)}
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <span>{column.header}</span>
                        {sortable && column.sortable !== false && getSortIcon(column.accessorKey)}
                      </div>
                    </div>
                  </th>
                ))}

                {(editable || rowActions) && (
                  <th className={cn("w-12", getCellPadding())}>
                    <span className="text-muted-foreground">Actions</span>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectable ? 1 : 0) + ((editable || rowActions) ? 1 : 0)}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{emptyMessage}</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/30 transition-colors group",
                      isRowSelected(row) && "bg-primary/5 hover:bg-primary/10",
                      zebra && rowIndex % 2 === 1 && "bg-muted/20",
                      "cursor-pointer"
                    )}
                  >
                    {selectable && (
                      <td className={getCellPadding()}>
                        <Checkbox
                          checked={isRowSelected(row)}
                          onCheckedChange={() => handleRowSelect(row)}
                        />
                      </td>
                    )}

                    {visibleColumns.map(column => (
                      <td
                        key={column.id}
                        className={cn(
                          getCellPadding(),
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.sticky && 'sticky left-0 bg-background',
                          isRowSelected(row) && column.sticky && 'bg-primary/5 group-hover:bg-primary/10'
                        )}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth
                        }}
                      >
                        {editingCell?.rowIndex === rowIndex && editingCell?.columnId === column.accessorKey ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onRowEdit?.(row, column.accessorKey, editValue);
                                  setEditingCell(null);
                                }
                                if (e.key === 'Escape') {
                                  setEditingCell(null);
                                }
                              }}
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                onRowEdit?.(row, column.accessorKey, editValue);
                                setEditingCell(null);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCell(null)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className={cn(
                              editable && "cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors",
                              "min-h-[1.5rem] flex items-center"
                            )}
                            onClick={() => {
                              if (editable) {
                                setEditingCell({ rowIndex, columnId: column.accessorKey });
                                setEditValue(String(row[column.accessorKey] || ''));
                              }
                            }}
                          >
                            {column.cell
                              ? column.cell(row[column.accessorKey], row, rowIndex)
                              : String(row[column.accessorKey] || '')}
                          </div>
                        )}
                      </td>
                    ))}

                    {(editable || rowActions) && (
                      <td className={getCellPadding()}>
                        <div className="flex items-center gap-1">
                          {rowActions && rowActions(row, rowIndex)}
                          {editable && !rowActions && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCell({ rowIndex, columnId: visibleColumns[0].accessorKey });
                                setEditValue(String(row[visibleColumns[0].accessorKey] || ''));
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedData.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">{emptyMessage}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <Card
              key={rowIndex}
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                isRowSelected(row) && "ring-2 ring-primary/20 bg-primary/5"
              )}
            >
              <CardContent className={cn(getCellPadding())}>
                {selectable && (
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                    <Checkbox
                      checked={isRowSelected(row)}
                      onCheckedChange={() => handleRowSelect(row)}
                    />
                    <span className="text-sm font-medium">Select this item</span>
                  </div>
                )}

                <div className="space-y-3">
                  {visibleColumns.map(column => (
                    <div key={column.id} className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {column.header}
                        </span>
                        {filterable && column.filterable !== false && getFilterIcon(column.accessorKey)}
                      </div>
                      <div className="text-sm font-medium">
                        {column.cell
                          ? column.cell(row[column.accessorKey], row, rowIndex)
                          : String(row[column.accessorKey] || '-')}
                      </div>
                    </div>
                  ))}
                </div>

                {(editable || rowActions) && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-end gap-2">
                      {rowActions && rowActions(row, rowIndex)}
                      {editable && !rowActions && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCell({ rowIndex, columnId: visibleColumns[0].accessorKey });
                            setEditValue(String(row[visibleColumns[0].accessorKey] || ''));
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Enhanced Pagination */}
      {pagination && totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{((currentPage - 1) * currentPageSize) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * currentPageSize, filteredAndSortedData.length)}</span> of{' '}
                <span className="font-medium">{filteredAndSortedData.length}</span> results
                {selectedRows.length > 0 && (
                  <span className="ml-2 text-primary">
                    • {selectedRows.length} selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  First
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
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
                        className="w-10 h-8"
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
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectable && selectedRows.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm font-medium">
                  {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                {exportable && (
                  <Select onValueChange={handleExport}>
                    <SelectTrigger className="w-40">
                      <Download className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Export Selected" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">Export Selected CSV</SelectItem>
                      <SelectItem value="excel">Export Selected Excel</SelectItem>
                      <SelectItem value="pdf">Export Selected PDF</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRows([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { DataTable };
export default DataTable;
