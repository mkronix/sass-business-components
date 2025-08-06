import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    Bookmark,
    Building,
    Check, ChevronDown, ChevronLeft, ChevronRight,
    Copy,
    Download, Edit2, Filter, FilterX, Grid3X3, List, Mail,
    Package,
    Plus,
    RefreshCw,
    Search,
    Share,
    Star, Trash2, X
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { ListItem, ListViewProps, FilterConfig, SortConfig } from './types';

const DefaultTemplate: React.FC<{
    item: ListItem;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
    onClick?: (event: React.MouseEvent) => void;
    customActions?: React.ReactNode;
    density?: 'compact' | 'normal' | 'comfortable';
}> = ({ item, isSelected, onSelect, onClick, customActions, density = 'normal' }) => {
    const paddingClass = {
        compact: 'p-3',
        normal: 'p-4',
        comfortable: 'p-6'
    }[density];

    return (
        <div
            className={cn(
                "flex items-center gap-4 border-b hover:bg-muted/50 transition-all duration-200 cursor-pointer group",
                isSelected && "bg-primary/5 border-primary/20",
                paddingClass
            )}
            onClick={onClick}
        >
            <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
            />

            {item.avatar && (
                <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full border-2 border-background shadow-sm"
                />
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{item.email}</p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {customActions}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    {item.department && (
                        <Badge variant="outline" className="text-xs">
                            <Building className="h-3 w-3 mr-1" />
                            {item.department}
                        </Badge>
                    )}

                    {item.status && (
                        <Badge
                            variant={item.status === 'Active' ? 'default' : 'secondary'}
                            className="text-xs"
                        >
                            {item.status}
                        </Badge>
                    )}

                    {item.rating && (
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-3 w-3",
                                        i < item.rating ? "text-yellow-500 fill-current" : "text-muted-foreground"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CardTemplate: React.FC<{
    item: ListItem;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
    onClick?: (event: React.MouseEvent) => void;
    customActions?: React.ReactNode;
}> = ({ item, isSelected, onSelect, onClick, customActions }) => (
    <Card
        className={cn(
            "p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 group",
            isSelected && "border-primary bg-primary/5 shadow-md"
        )}
        onClick={onClick}
    >
        <div className="space-y-3">
            <div className="flex items-start justify-between">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {customActions}
                </div>
            </div>

            <div className="text-center">
                {item.avatar && (
                    <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-primary/10"
                    />
                )}
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.position}</p>

                <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                    {item.department && (
                        <Badge variant="outline" className="text-xs">
                            {item.department}
                        </Badge>
                    )}
                    {item.status && (
                        <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                            {item.status}
                        </Badge>
                    )}
                </div>

                {item.rating && (
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-3 w-3",
                                    i < item.rating ? "text-yellow-500 fill-current" : "text-muted-foreground"
                                )}
                            />
                        ))}
                    </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center justify-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{item.email}</span>
                    </div>
                    {item.projects && (
                        <div className="flex items-center justify-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{item.projects} projects</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Card>
);

const ListView = <T extends ListItem>({
    data = [],
    columns = [],
    loading = false,
    selectable = true,
    multiSelect = true,
    searchable = true,
    filterable = true,
    sortable = true,
    pagination = true,
    exportable = false,
    pageSize = 20,
    pageSizeOptions = [10, 20, 50, 100],
    density = 'normal',
    defaultTemplate = 'default',
    className,
    groupBy,
    showGroupHeaders = true,
    collapsibleGroups = true,
    emptyMessage = "No items found",
    emptyDescription = "Try adjusting your search or filter criteria",
    quickFilters = [],
    bulkActions = [],
    onItemClick,
    onSelectionChange,
    onSortChange,
    onFilterChange,
    onPageChange,
    onSearchChange,
    onEdit,
    onDelete,
    onDuplicate,
    onBookmark,
    onShare,
    onExport,
    onRefresh,
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
    const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

    // Available templates
    const templates = [
        { id: 'default', name: 'List View', icon: <List className="h-4 w-4" /> },
        { id: 'card', name: 'Card View', icon: <Grid3X3 className="h-4 w-4" /> }
    ];

    // Filter application function (moved before usage)
    const applyFilter = useCallback((value: any, filter: FilterConfig): boolean => {
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
    }, []);

    // Data processing
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(query)
                )
            );
        }

        // Apply quick filters
        activeQuickFilters.forEach(filterId => {
            const quickFilter = quickFilters.find(f => f.id === filterId);
            if (quickFilter) {
                result = result.filter(item => {
                    const value = item[quickFilter.field];
                    // Handle different operators for quick filters
                    switch (quickFilter.operator) {
                        case 'gte':
                            return Number(value) >= Number(quickFilter.value);
                        case 'contains':
                            return String(value).toLowerCase().includes(String(quickFilter.value).toLowerCase());
                        default:
                            return value === quickFilter.value;
                    }
                });
            }
        });

        // Apply advanced filters
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
    }, [data, searchQuery, filters, sorting, activeQuickFilters, quickFilters, applyFilter]);

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

    // Event handlers
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

    const handleQuickFilterToggle = useCallback((filterId: string) => {
        setActiveQuickFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
    }, []);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        onSearchChange?.(query);
    }, [onSearchChange]);

    // Render functions
    const renderItem = useCallback((item: T, index: number) => {
        const itemId = getItemId(item);
        const isSelected = selectedItems.has(itemId);

        const itemActions = (
            <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(item);
                }}>
                    <Edit2 className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate?.(item);
                }}>
                    <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                    e.stopPropagation();
                    onBookmark?.(item);
                }}>
                    <Bookmark className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(item);
                }}>
                    <Share className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item);
                }}>
                    <Trash2 className="h-3 w-3" />
                </Button>
                {customActions?.(item)}
            </div>
        );

        const commonProps = {
            item,
            isSelected,
            onSelect: (selected: boolean) => handleItemSelection(itemId, selected),
            onClick: (event: React.MouseEvent) => onItemClick?.(item, event),
            customActions: itemActions
        };

        if (currentTemplate === 'card') {
            return (
                <CardTemplate
                    key={itemId}
                    {...commonProps}
                />
            );
        }

        return (
            <DefaultTemplate
                key={itemId}
                density={density}
                {...commonProps}
            />
        );
    }, [
        selectedItems,
        currentTemplate,
        density,
        handleItemSelection,
        onItemClick,
        onEdit,
        onDelete,
        onDuplicate,
        onBookmark,
        onShare,
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
                <div key={groupName} className="space-y-2">
                    {showGroupHeaders && (
                        <div
                            className={cn(
                                "flex items-center justify-between p-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                                collapsibleGroups && "cursor-pointer"
                            )}
                            onClick={() => collapsibleGroups && setGroupExpanded(prev => ({
                                ...prev,
                                [groupName]: !isExpanded
                            }))}
                        >
                            <div className="flex items-center gap-3">
                                {collapsibleGroups && (
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 transition-transform",
                                            !isExpanded && "-rotate-90"
                                        )}
                                    />
                                )}
                                <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">{groupName}</h3>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {groupCount} {groupCount === 1 ? 'item' : 'items'}
                            </Badge>
                        </div>
                    )}

                    {isExpanded && (
                        <div className={cn(
                            currentTemplate === 'card'
                                ? "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                : "space-y-0 border rounded-lg bg-card overflow-hidden"
                        )}>
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
                    <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                    </div>
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 w-full bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col space-y-6", className)}>
            {/* Enhanced Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1">
                    {searchable && (
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10 pr-4"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                    onClick={() => handleSearchChange('')}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
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
                                {(filters.length > 0 || activeQuickFilters.length > 0) && (
                                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                                        {filters.length + activeQuickFilters.length}
                                    </Badge>
                                )}
                            </Button>
                        )}

                        {(filters.length > 0 || activeQuickFilters.length > 0) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFilters([]);
                                    setActiveQuickFilters([]);
                                }}
                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                            >
                                <FilterX className="h-4 w-4" />
                                Clear
                            </Button>
                        )}

                        {selectedItems.size > 0 && (
                            <Badge variant="secondary" className="px-3 py-1 text-sm">
                                {selectedItems.size} selected
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {customToolbar}

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

                    {/* Template Selector */}
                    <Select value={currentTemplate} onValueChange={setCurrentTemplate}>
                        <SelectTrigger className="w-max">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                    <div className="flex items-center gap-2">
                                        {template.icon}
                                        {template.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {exportable && (
                        <Select onValueChange={(format: any) => {
                            const exportData = selectedItems.size > 0
                                ? data.filter(item => selectedItems.has(getItemId(item)))
                                : processedData;
                            onExport?.(format, exportData);
                        }}>
                            <SelectTrigger className="w-max">
                                <Download className="h-4 w-4 mr-2" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">Export CSV</SelectItem>
                                <SelectItem value="excel">Export Excel</SelectItem>
                                <SelectItem value="json">Export JSON</SelectItem>
                                <SelectItem value="pdf">Export PDF</SelectItem>
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

            {/* Quick Filters */}
            {quickFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {quickFilters.map((filter) => (
                        <Button
                            key={filter.id}
                            variant={activeQuickFilters.includes(filter.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleQuickFilterToggle(filter.id)}
                            className="flex items-center gap-2"
                        >
                            {filter.icon}
                            {filter.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Advanced Filters Panel */}
            {showFilters && filterable && (
                <Card className="border-2 border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Advanced Filters
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filters.map((filter, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                                <Select
                                    value={filter.field}
                                    onValueChange={(value) => {
                                        const newFilters = [...filters];
                                        newFilters[index] = { ...filter, field: value };
                                        setFilters(newFilters);
                                    }}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.filter(col => col.filterable !== false).map((column) => (
                                            <SelectItem key={column.id} value={column.field as string}>
                                                {column.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filter.operator}
                                    onValueChange={(value: any) => {
                                        const newFilters = [...filters];
                                        newFilters[index] = { ...filter, operator: value };
                                        setFilters(newFilters);
                                    }}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="contains">Contains</SelectItem>
                                        <SelectItem value="equals">Equals</SelectItem>
                                        <SelectItem value="startsWith">Starts with</SelectItem>
                                        <SelectItem value="endsWith">Ends with</SelectItem>
                                        <SelectItem value="gt">Greater than</SelectItem>
                                        <SelectItem value="lt">Less than</SelectItem>
                                        <SelectItem value="gte">≥</SelectItem>
                                        <SelectItem value="lte">≤</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    value={filter.value}
                                    onChange={(e) => {
                                        const newFilters = [...filters];
                                        newFilters[index] = { ...filter, value: e.target.value };
                                        setFilters(newFilters);
                                    }}
                                    placeholder="Filter value..."
                                    className="flex-1"
                                />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilters(filters.filter((_, i) => i !== index))}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setFilters([...filters, {
                                    field: columns[0]?.field as string || 'name',
                                    operator: 'contains',
                                    value: ''
                                }])}
                                className="flex-1"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Filter
                            </Button>
                            {filters.length > 0 && (
                                <Button variant="outline" onClick={() => setFilters([])}>
                                    <FilterX className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content */}
            <div className="flex-1">
                {processedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-muted rounded-lg">
                        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{emptyMessage}</h3>
                        <p className="text-muted-foreground max-w-md mb-6">{emptyDescription}</p>

                        {(searchQuery || filters.length > 0 || activeQuickFilters.length > 0) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilters([]);
                                    setActiveQuickFilters([]);
                                }}
                                className="mt-4"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear Search & Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {renderGroupedContent()}
                    </div>
                )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedItems.size > 0 && bulkActions.length > 0 && (
                <Card className="bg-primary/5 border-primary/20 transition-all duration-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="font-medium">
                                    {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {bulkActions.map((action) => (
                                    <Button
                                        key={action.id}
                                        variant={action.variant || 'outline'}
                                        size="sm"
                                        onClick={() => {
                                            const selectedData = data.filter(item => selectedItems.has(getItemId(item)));
                                            action.action(selectedData);
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        {action.icon}
                                        {action.label}
                                    </Button>
                                ))}
                                <Button
                                    variant="ghost"
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

            {/* Enhanced Pagination */}
            {pagination && processedData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * currentPageSize) + 1} to{' '}
                        {Math.min(currentPage * currentPageSize, processedData.length)} of{' '}
                        {processedData.length.toLocaleString()} items
                        {selectedItems.size > 0 && (
                            <span className="ml-2 text-primary font-medium">
                                • {selectedItems.size} selected
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <Select
                                value={String(currentPageSize)}
                                onValueChange={(value) => {
                                    const newPageSize = Number(value);
                                    setCurrentPageSize(newPageSize);
                                    setCurrentPage(1);
                                    onPageChange?.(1, newPageSize);
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
                        </div>

                        <div className="flex items-center gap-1">
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
                                        className="min-w-[2.5rem]"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}

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
                </div>
            )}
        </div>
    );
};

export default ListView;