import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    ArrowUpDown,
    Building,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Download,
    Edit2,
    Filter,
    FilterX,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    SortAsc,
    SortDesc,
    Trash2,
    X
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FilterConfig, ListItem, ListItemProps, ListTemplate, ListViewProps, SortConfig } from './types';
const getBuiltInTemplates = <T extends ListItem>(): ListTemplate<T>[] => [
    {
        id: 'default',
        name: 'Default List',
        description: 'Simple list with basic information',
        component: ({ item, isSelected, onSelect, onClick, columns, customActions }) => (
            <div
                className={cn(
                    "flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer",
                    isSelected && "bg-primary/5 border-primary/20"
                )}
                onClick={onClick}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="flex items-center gap-2">
                            {customActions}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.email}</p>
                    {item.department && (
                        <Badge variant="outline" className="mt-1 text-xs">
                            {item.department}
                        </Badge>
                    )}
                </div>
            </div>
        ),
        itemHeight: 80
    },
    {
        id: 'compact',
        name: 'Compact List',
        description: 'Dense list for maximum information density',
        component: ({ item, isSelected, onSelect, onClick, customActions }) => (
            <div
                className={cn(
                    "flex items-center gap-3 p-2 border-b hover:bg-muted/30 transition-colors cursor-pointer",
                    isSelected && "bg-primary/5"
                )}
                onClick={onClick}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4"
                />
                {item.avatar && (
                    <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-6 h-6 rounded-full"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.name}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground truncate">{item.department}</span>
                        {item.status && (
                            <Badge variant="outline" className="h-4 text-xs px-1">
                                {item.status}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {customActions}
                </div>
            </div>
        ),
        itemHeight: 40,
        spacing: 'tight'
    },
    {
        id: 'detailed',
        name: 'Detailed View',
        description: 'Rich layout with comprehensive information',
        component: ({ item, isSelected, onSelect, onClick, customActions }) => (
            <div
                className={cn(
                    "p-6 border rounded-lg hover:shadow-sm transition-all cursor-pointer",
                    isSelected && "ring-0 ring-primary/20 bg-primary/5"
                )}
                onClick={onClick}
            >
                <div className="flex items-start gap-4">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onSelect}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                    />
                    {item.avatar && (
                        <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-12 h-12 rounded-full"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-muted-foreground">{item.position} • {item.department}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.status && (
                                    <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                                        {item.status}
                                    </Badge>
                                )}
                                {item.priority && (
                                    <Badge
                                        variant={
                                            item.priority === 'Critical' ? 'destructive' :
                                                item.priority === 'High' ? 'default' : 'outline'
                                        }
                                    >
                                        {item.priority}
                                    </Badge>
                                )}
                                {customActions}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{item.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{item.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{item.city}</span>
                            </div>
                            {item.salary && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>${item.salary.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{item.joinDate?.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span>{item.projects} projects</span>
                            </div>
                        </div>

                        {item.bio && (
                            <p className="text-sm text-muted-foreground mb-3">{item.bio}</p>
                        )}

                        {item.skills && (
                            <div className="flex flex-wrap gap-1">
                                {item.skills.slice(0, 5).map((skill: string) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                                {item.skills.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{item.skills.length - 5} more
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ),
        itemHeight: 220,
        spacing: 'loose'
    }
];

const ListView = <T extends ListItem>({
    data = [],
    columns = [],
    templates,
    loading = false,
    selectable = true,
    multiSelect = true,
    searchable = true,
    filterable = true,
    sortable = true,
    pagination = true,
    pageSize = 20,
    pageSizeOptions = [10, 20, 50, 100],
    exportable = false,
    emptyMessage = "No items found",
    emptyDescription = "Try adjusting your search or filter criteria",
    className,
    itemClassName,
    density = 'normal',
    layout = 'list',
    defaultTemplate = 'default',
    virtualScrolling = false,
    groupBy,
    showGroupHeaders = true,
    stickyHeaders = false,
    onItemClick,
    onItemDoubleClick,
    onSelectionChange,
    onSortChange,
    onFilterChange,
    onPageChange,
    onEdit,
    onDelete,
    onExport,
    customToolbar,
    customActions,
    getItemId = (item) => item.id
}: ListViewProps<T>) => {
    // State
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [sorting, setSorting] = useState<SortConfig[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [currentTemplate, setCurrentTemplate] = useState(defaultTemplate);
    const [showFilters, setShowFilters] = useState(false);
    const [groupExpanded, setGroupExpanded] = useState<Record<string, boolean>>({});

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);

    // Get templates
    const allTemplates = useMemo(() => {
        const builtInTemplates = getBuiltInTemplates<T>();
        return templates ? [...builtInTemplates, ...templates] : builtInTemplates;
    }, [templates]);

    const activeTemplate = allTemplates.find(t => t.id === currentTemplate) || allTemplates[0];

    // Data processing
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                columns.some(col => {
                    if (!col.searchable && col.searchable !== undefined) return false;
                    const value = String(item[col.field] || '').toLowerCase();
                    return value.includes(query);
                }) ||
                // Fallback to searching all string fields
                Object.values(item).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(query)
                )
            );
        }

        // Apply filters
        filters.forEach(filter => {
            result = result.filter(item => {
                const value = item[filter.field];
                return applyFilter(value, filter);
            });
        });

        // Apply sorting
        if (sorting.length > 0) {
            result.sort((a, b) => {
                for (const sort of sorting) {
                    const aValue = a[sort.field];
                    const bValue = b[sort.field];

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
    }, [data, searchQuery, filters, sorting, columns]);

    // Grouping
    const groupedData = useMemo(() => {
        if (!groupBy) return { ungrouped: processedData };

        const groups: Record<string, T[]> = {};
        processedData.forEach(item => {
            const groupValue = String(item[groupBy] || 'Other');
            if (!groups[groupValue]) {
                groups[groupValue] = [];
            }
            groups[groupValue].push(item);
        });

        return groups;
    }, [processedData, groupBy]);

    // Pagination
    const paginatedData = useMemo(() => {
        if (!pagination) return processedData;
        const start = (currentPage - 1) * currentPageSize;
        return processedData.slice(start, start + currentPageSize);
    }, [processedData, pagination, currentPage, currentPageSize]);

    const totalPages = Math.ceil(processedData.length / currentPageSize);

    // Filter application
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
            default:
                return true;
        }
    };

    // Event handlers
    const handleSort = useCallback((field: string) => {
        setSorting(prev => {
            const existingSort = prev.find(s => s.field === field);
            if (existingSort) {
                if (existingSort.direction === 'asc') {
                    return prev.map(s => s.field === field ? { ...s, direction: 'desc' as const } : s);
                } else {
                    return prev.filter(s => s.field !== field);
                }
            } else {
                return [{ field, direction: 'asc' as const }];
            }
        });
    }, []);

    const handleItemSelection = useCallback((itemId: string | number, selected: boolean) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (selected) {
                if (!multiSelect) {
                    newSet.clear();
                }
                newSet.add(itemId);
            } else {
                newSet.delete(itemId);
            }

            if (onSelectionChange) {
                const selectedData = data.filter(item => newSet.has(getItemId(item)));
                onSelectionChange(selectedData);
            }

            return newSet;
        });
    }, [data, multiSelect, onSelectionChange, getItemId]);

    const handleSelectAll = useCallback(() => {
        const currentData = pagination ? paginatedData : processedData;
        const allIds = currentData.map(item => getItemId(item));
        const allSelected = allIds.every(id => selectedItems.has(id));

        if (allSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(allIds));
        }
    }, [pagination, paginatedData, processedData, selectedItems, getItemId]);

    const handleExport = useCallback((format: 'csv' | 'excel' | 'json') => {
        const exportData = selectedItems.size > 0
            ? data.filter(item => selectedItems.has(getItemId(item)))
            : processedData;

        onExport?.(format, exportData);
    }, [data, selectedItems, processedData, onExport, getItemId]);

    // Render functions
    const renderItem = useCallback((item: T, index: number) => {
        const itemId = getItemId(item);
        const isSelected = selectedItems.has(itemId);

        const itemProps: ListItemProps<T> = {
            item,
            index,
            isSelected,
            isHighlighted: false,
            onSelect: (selected) => handleItemSelection(itemId, selected),
            onEdit: () => onEdit?.(item),
            onDelete: () => onDelete?.(item),
            onClick: (event) => onItemClick?.(item, event),
            onDoubleClick: (event) => onItemDoubleClick?.(item, event),
            template: activeTemplate,
            columns,
            customActions: customActions?.(item)
        };

        return (
            <div
                key={itemId}
                className={cn(
                    "transition-colors",
                    itemClassName,
                    density === 'compact' && "py-1",
                    density === 'comfortable' && "py-2"
                )}
            >
                <activeTemplate.component {...itemProps} />
            </div>
        );
    }, [
        activeTemplate,
        selectedItems,
        columns,
        itemClassName,
        density,
        handleItemSelection,
        onEdit,
        onDelete,
        onItemClick,
        onItemDoubleClick,
        customActions,
        getItemId
    ]);

    const renderGroupedContent = () => {
        if (!groupBy) {
            const currentData = pagination ? paginatedData : processedData;
            return currentData.map((item, index) => renderItem(item, index));
        }

        return Object.entries(groupedData).map(([groupName, groupItems]) => {
            const isExpanded = groupExpanded[groupName] !== false;
            const groupCount = groupItems.length;

            return (
                <div key={groupName}>
                    {showGroupHeaders && (
                        <div
                            className={cn(
                                "flex items-center justify-between p-3 bg-muted/50 border-b cursor-pointer",
                                stickyHeaders && "sticky top-0 z-10"
                            )}
                            onClick={() => setGroupExpanded(prev => ({
                                ...prev,
                                [groupName]: !isExpanded
                            }))}
                        >
                            <div className="flex items-center gap-2">
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 transition-transform",
                                        !isExpanded && "-rotate-90"
                                    )}
                                />
                                <h3 className="font-medium">{groupName}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {groupCount}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {isExpanded && (
                        <div>
                            {groupItems.map((item, index) => renderItem(item, index))}
                        </div>
                    )}
                </div>
            );
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
                    {searchable && (
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
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
                                Filters
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
                                onClick={() => setFilters([])}
                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                            >
                                <FilterX className="h-4 w-4" />
                                Clear
                            </Button>
                        )}

                        {selectedItems.size > 0 && (
                            <Badge variant="secondary" className="px-3 py-1">
                                {selectedItems.size} selected
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {customToolbar}

                    {/* Template Selector */}
                    <Select value={currentTemplate} onValueChange={setCurrentTemplate}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {allTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {exportable && (
                        <Select onValueChange={handleExport}>
                            <SelectTrigger className="w-max">
                                <Download className="h-4 w-4 mr-2" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">Export CSV</SelectItem>
                                <SelectItem value="excel">Export Excel</SelectItem>
                                <SelectItem value="json">Export JSON</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {selectable && multiSelect && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            {(pagination ? paginatedData : processedData).every(item => selectedItems.has(getItemId(item))) && processedData.length > 0
                                ? 'Deselect All'
                                : 'Select All'
                            }
                        </Button>
                    )}
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && filterable && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Advanced Filters</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {columns.filter(col => col.filterable !== false).map(column => {
                                const currentFilter = filters.find(f => f.field === column.field);

                                return (
                                    <div key={column.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium">{column.title}</label>
                                            {currentFilter && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setFilters(prev => prev.filter(f => f.field !== column.field))}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Select
                                                value={currentFilter?.operator || 'contains'}
                                                onValueChange={(operator: any) => {
                                                    setFilters(prev => {
                                                        const otherFilters = prev.filter(f => f.field !== column.field);
                                                        return [...otherFilters, {
                                                            field: column.field,
                                                            operator,
                                                            value: currentFilter?.value || ''
                                                        }];
                                                    });
                                                }}
                                            >
                                                <SelectTrigger className="w-28">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="contains">Contains</SelectItem>
                                                    <SelectItem value="equals">Equals</SelectItem>
                                                    <SelectItem value="startsWith">Starts with</SelectItem>
                                                    <SelectItem value="endsWith">Ends with</SelectItem>
                                                    {column.type === 'number' && (
                                                        <>
                                                            <SelectItem value="gt">Greater than</SelectItem>
                                                            <SelectItem value="lt">Less than</SelectItem>
                                                            <SelectItem value="gte">Greater or equal</SelectItem>
                                                            <SelectItem value="lte">Less or equal</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            <Input
                                                placeholder={`Filter ${column.title}...`}
                                                value={currentFilter?.value || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFilters(prev => {
                                                        const otherFilters = prev.filter(f => f.field !== column.field);
                                                        if (value === '') return otherFilters;
                                                        return [...otherFilters, {
                                                            field: column.field,
                                                            operator: currentFilter?.operator || 'contains',
                                                            value
                                                        }];
                                                    });
                                                }}
                                                type={column.type === 'number' ? 'number' : 'text'}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Table Headers for table template */}
            {currentTemplate === 'table' && columns.length > 0 && (
                <div className="border-b bg-muted/30">
                    <div
                        className="grid gap-4 p-3 font-medium text-sm"
                        style={{ gridTemplateColumns: `auto ${columns.map(col => col.width || '1fr').join(' ')} auto` }}
                    >
                        <div>{/* Checkbox column */}</div>
                        {columns.map(column => (
                            <div
                                key={column.id}
                                className={cn(
                                    "flex items-center gap-2",
                                    column.align === 'center' && 'justify-center',
                                    column.align === 'right' && 'justify-end',
                                    sortable && column.sortable !== false && 'cursor-pointer hover:text-primary'
                                )}
                                onClick={() => column.sortable !== false && handleSort(column.field)}
                            >
                                <span>{column.title}</span>
                                {sortable && column.sortable !== false && (
                                    <div className="flex flex-col">
                                        {(() => {
                                            const sort = sorting.find(s => s.field === column.field);
                                            if (!sort) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
                                            return sort.direction === 'asc'
                                                ? <SortAsc className="h-3 w-3 text-primary" />
                                                : <SortDesc className="h-3 w-3 text-primary" />;
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div>Actions</div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div
                ref={containerRef}
                className={cn(
                    "flex-1",
                    currentTemplate === 'card' && `grid gap-4 grid-cols-1 ${activeTemplate.gridCols === 2 ? 'md:grid-cols-2' :
                        activeTemplate.gridCols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
                            activeTemplate.gridCols === 4 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                                'md:grid-cols-2 lg:grid-cols-3'
                    }`,
                    activeTemplate.spacing === 'tight' && 'space-y-1',
                    activeTemplate.spacing === 'loose' && 'space-y-6',
                    !currentTemplate.includes('card') && 'space-y-0'
                )}
            >
                {processedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
                        <p className="text-muted-foreground max-w-sm">{emptyDescription}</p>
                        {(searchQuery || filters.length > 0) && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilters([]);
                                }}
                            >
                                Clear Search & Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className={cn(
                        currentTemplate !== 'card' && "border rounded-lg bg-card overflow-hidden"
                    )}>
                        {renderGroupedContent()}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && processedData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * currentPageSize) + 1} to{' '}
                        {Math.min(currentPage * currentPageSize, processedData.length)} of{' '}
                        {processedData.length} items
                        {selectedItems.size > 0 && (
                            <span className="ml-2 text-primary font-medium">
                                • {selectedItems.size} selected
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={String(currentPageSize)}
                            onValueChange={(value) => {
                                setCurrentPageSize(Number(value));
                                setCurrentPage(1);
                                onPageChange?.(1, Number(value));
                            }}
                        >
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

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newPage = Math.max(1, currentPage - 1);
                                setCurrentPage(newPage);
                                onPageChange?.(newPage, currentPageSize);
                            }}
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
                                        onClick={() => {
                                            setCurrentPage(page);
                                            onPageChange?.(page, currentPageSize);
                                        }}
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
                            onClick={() => {
                                const newPage = Math.min(totalPages, currentPage + 1);
                                setCurrentPage(newPage);
                                onPageChange?.(newPage, currentPageSize);
                            }}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedItems.size > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span className="text-sm font-medium">
                                    {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
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
                                            <SelectItem value="csv">Export CSV</SelectItem>
                                            <SelectItem value="excel">Export Excel</SelectItem>
                                            <SelectItem value="json">Export JSON</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                <Button variant="outline" size="sm">
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Bulk Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete Selected
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedItems(new Set())}
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

export default ListView;