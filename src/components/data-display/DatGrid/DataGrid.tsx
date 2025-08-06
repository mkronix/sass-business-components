// components/data-display/dataGrid/DataGrid.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    Building,
    Calendar,
    Hash,
    Search,
    Shield,
    SortAsc,
    SortDesc,
    Tags,
    X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGridProps, FilterConfig, GridApi, SortConfig } from './types';

import ContextMenu from './ContextMenu';
import FilterModal from './FilterModal';
import ItemCard from './ItemCard';
import KeyboardHelpModal from './KeyboardHelpModal';
import Pagination from './Pagination';
import PreviewModal from './PreviewModal';
import SettingsModal from './SettingsModal';
import StatsBar from './StatsBar';
import Toolbar from './Toolbar';
import UndoNotification from './UndoNotification';

// Types
type ViewMode = 'grid' | 'compact' | 'cards';
type GridSize = 'small' | 'medium' | 'large';
type GroupBy = 'none' | 'department' | 'status' | 'tags' | 'hireDate';
type QuickFilter = 'all' | 'recent' | 'pinned' | 'favorites' | 'active' | 'inactive';

interface UndoAction {
    id: string;
    type: 'delete' | 'edit' | 'bulk-delete';
    timestamp: Date;
    data: any;
    description: string;
}

const DataGrid = <T extends Record<string, any>>({
    data = [],
    columns = [],
    loading = false,
    enableRowSelection = true,
    enableMultiSelect = true,
    enableInlineEditing = true,
    enableBulkOperations = true,
    enableExport = true,
    enableContextMenu = true,
    pageSize = 100,
    pagination = true,
    className,
    density = 'standard',
    getRowId = (row) => row.id,
    onRowClick,
    onRowDoubleClick,
    onCellEdit,
    onSelectionChange,
    customToolbar,
    customFooter
}: DataGridProps<T>) => {
    // State management
    const [gridData, setGridData] = useState<T[]>(data);
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
    const [sorting, setSorting] = useState<SortConfig[]>([]);
    const [filters, setFilters] = useState<Record<string, FilterConfig>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    // Context menu state
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row?: T; cardRef?: HTMLElement } | null>(null);

    // UI state
    const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [gridSize, setGridSize] = useState<GridSize>('medium');

    // Enhanced features state
    const [pinnedItems, setPinnedItems] = useState<Set<string | number>>(new Set());
    const [groupBy, setGroupBy] = useState<GroupBy>('none');
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
    const [previewItem, setPreviewItem] = useState<T | null>(null);
    const [undoHistory, setUndoHistory] = useState<UndoAction[]>([]);
    const [showUndoNotification, setShowUndoNotification] = useState(false);
    const [lastUndoAction, setLastUndoAction] = useState<UndoAction | null>(null);
    const [highlightedItems, setHighlightedItems] = useState<Set<string | number>>(new Set());

    // Refs
    const gridRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Update grid data when prop changes
    useEffect(() => {
        setGridData(data);
    }, [data]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const cmdKey = isMac ? e.metaKey : e.ctrlKey;

            // Ctrl/Cmd + A - Select All
            if (cmdKey && e.key === 'a') {
                e.preventDefault();
                handleSelectAll();
            }
            // Ctrl/Cmd + F - Focus search
            else if (cmdKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder="Search items..."]') as HTMLInputElement;
                searchInput?.focus();
            }
            // Ctrl/Cmd + Z - Undo
            else if (cmdKey && e.key === 'z') {
                e.preventDefault();
                handleUndo();
            }
            // Escape - Clear selection, close preview
            else if (e.key === 'Escape') {
                setSelectedRows(new Set());
                setShowPreview(false);
                setContextMenu(null);
            }
            // ? - Show keyboard help
            else if (e.key === '?' && !e.shiftKey) {
                e.preventDefault();
                setShowKeyboardHelp(true);
            }
            // 1-4 - Quick view modes
            else if (['1', '2', '3', '4'].includes(e.key) && !cmdKey) {
                e.preventDefault();
                if (e.key === '1') setViewMode('grid');
                else if (e.key === '2') setViewMode('compact');
                else if (e.key === '3') setGridSize('small');
                else if (e.key === '4') setGridSize('large');
            }
            // G - Group by department
            else if (e.key === 'g' && !cmdKey) {
                e.preventDefault();
                setGroupBy(prev => prev === 'department' ? 'none' : 'department');
            }
        };

        document.addEventListener('keydown', handleKeyboard);
        return () => document.removeEventListener('keydown', handleKeyboard);
    }, [undoHistory]);

    // Click outside context menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-hide undo notification
    useEffect(() => {
        if (showUndoNotification) {
            const timer = setTimeout(() => {
                setShowUndoNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showUndoNotification]);

    // Handle search highlighting
    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const highlighted = new Set<string | number>();

            gridData.forEach(row => {
                const matches = columns.some(col => {
                    const value = row[col.field];
                    const stringValue = String(value || '').toLowerCase();
                    return stringValue.includes(query);
                });
                if (matches) {
                    highlighted.add(getRowId(row));
                }
            });

            setHighlightedItems(highlighted);
        } else {
            setHighlightedItems(new Set());
        }
    }, [searchQuery, gridData, columns, getRowId]);

    // Memoized computed values
    const allTags = useMemo(() => {
        return [...new Set(gridData.flatMap(item => item.tags || []))];
    }, [gridData]);

    const allStatuses = useMemo(() => {
        return [...new Set(gridData.map(item => item.status).filter(Boolean))];
    }, [gridData]);

    // Undo functionality
    const addUndoAction = useCallback((action: UndoAction) => {
        setUndoHistory(prev => [...prev.slice(-9), action]);
        setLastUndoAction(action);
        setShowUndoNotification(true);
    }, []);

    const handleUndo = useCallback(() => {
        if (undoHistory.length === 0) return;

        const lastAction = undoHistory[undoHistory.length - 1];

        switch (lastAction.type) {
            case 'delete':
                setGridData(prev => [...prev, lastAction.data]);
                break;
            case 'bulk-delete':
                setGridData(prev => [...prev, ...lastAction.data]);
                break;
            case 'edit':
                setGridData(prev => prev.map(item =>
                    getRowId(item) === lastAction.data.id ? lastAction.data.original : item
                ));
                break;
        }

        setUndoHistory(prev => prev.slice(0, -1));
        setShowUndoNotification(false);
    }, [undoHistory, getRowId]);

    // Data processing
    const processedData = useMemo(() => {
        let result = [...gridData];

        // Apply quick filters
        switch (quickFilter) {
            case 'recent':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                result = result.filter(row => {
                    const hireDate = new Date(row.hireDate);
                    return hireDate >= weekAgo;
                });
                break;
            case 'pinned':
                result = result.filter(row => pinnedItems.has(getRowId(row)));
                break;
            case 'favorites':
                result = result.filter(row => favorites.has(getRowId(row)));
                break;
            case 'active':
                result = result.filter(row => row.status === 'Active');
                break;
            case 'inactive':
                result = result.filter(row => row.status !== 'Active');
                break;
        }

        // Apply tag filters
        if (selectedTags.length > 0) {
            result = result.filter(row =>
                row.tags && row.tags.some((tag: string) => selectedTags.includes(tag))
            );
        }

        // Apply status filters
        if (selectedStatuses.length > 0) {
            result = result.filter(row => selectedStatuses.includes(row.status));
        }

        // Apply global search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(row => {
                return columns.some(col => {
                    const value = row[col.field];
                    const stringValue = String(value || '').toLowerCase();
                    return stringValue.includes(query);
                });
            });
        }

        // Apply column filters
        Object.entries(filters).forEach(([columnId, filter]) => {
            const column = columns.find(col => col.id === columnId);
            if (!column) return;

            result = result.filter(row => {
                const value = row[column.field];
                return applyFilter(value, filter);
            });
        });

        // Apply sorting
        if (sorting.length > 0) {
            result.sort((a, b) => {
                for (const sort of sorting.sort((x, y) => x.priority - y.priority)) {
                    const column = columns.find(col => col.id === sort.columnId);
                    if (!column) continue;

                    const aValue = a[column.field];
                    const bValue = b[column.field];

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

        // Sort pinned items to top
        return result.sort((a, b) => {
            const aId = getRowId(a);
            const bId = getRowId(b);
            const aPinned = pinnedItems.has(aId);
            const bPinned = pinnedItems.has(bId);

            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return 0;
        });
    }, [gridData, searchQuery, filters, sorting, columns, pinnedItems, quickFilter, selectedTags, selectedStatuses, favorites, getRowId]);

    // Group processed data
    const groupedData = useMemo(() => {
        if (groupBy === 'none') return { 'All Items': processedData };

        const groups: Record<string, T[]> = {};

        processedData.forEach(item => {
            let groupKey = 'Other';

            switch (groupBy) {
                case 'department':
                    groupKey = item.department || 'No Department';
                    break;
                case 'status':
                    groupKey = item.status || 'No Status';
                    break;
                case 'tags':
                    if (item.tags && item.tags.length > 0) {
                        groupKey = item.tags[0];
                    } else {
                        groupKey = 'No Tags';
                    }
                    break;
                case 'hireDate':
                    if (item.hireDate) {
                        const date = new Date(item.hireDate);
                        const year = date.getFullYear();
                        const month = date.toLocaleString('default', { month: 'long' });
                        groupKey = `${month} ${year}`;
                    } else {
                        groupKey = 'No Hire Date';
                    }
                    break;
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        const sortedGroups: Record<string, T[]> = {};
        Object.keys(groups).sort().forEach(key => {
            sortedGroups[key] = groups[key];
        });

        return sortedGroups;
    }, [processedData, groupBy]);

    // Pagination with grouping support
    const paginatedData = useMemo(() => {
        if (!pagination) return groupedData;

        const allItems = Object.values(groupedData).flat();
        const start = (currentPage - 1) * currentPageSize;
        const paginatedItems = allItems.slice(start, start + currentPageSize);

        if (groupBy === 'none') {
            return { 'All Items': paginatedItems };
        }

        const paginatedGroups: Record<string, T[]> = {};
        paginatedItems.forEach(item => {
            let groupKey = 'Other';

            switch (groupBy) {
                case 'department':
                    groupKey = item.department || 'No Department';
                    break;
                case 'status':
                    groupKey = item.status || 'No Status';
                    break;
                case 'tags':
                    groupKey = item.tags && item.tags.length > 0 ? item.tags[0] : 'No Tags';
                    break;
                case 'hireDate':
                    if (item.hireDate) {
                        const date = new Date(item.hireDate);
                        const year = date.getFullYear();
                        const month = date.toLocaleString('default', { month: 'long' });
                        groupKey = `${month} ${year}`;
                    } else {
                        groupKey = 'No Hire Date';
                    }
                    break;
            }

            if (!paginatedGroups[groupKey]) {
                paginatedGroups[groupKey] = [];
            }
            paginatedGroups[groupKey].push(item);
        });

        return paginatedGroups;
    }, [groupedData, pagination, currentPage, currentPageSize, groupBy]);

    const totalPages = Math.ceil(Object.values(groupedData).flat().length / currentPageSize);

    // Filter application logic
    const applyFilter = (value: any, filter: FilterConfig): boolean => {
        if (filter.value === '' || filter.value == null) return true;

        switch (filter.operator) {
            case 'equals':
                return value === filter.value;
            case 'contains':
                return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            default:
                return true;
        }
    };

    // Event handlers
    const handleRowSelection = useCallback((rowId: string | number, selected: boolean) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(rowId);
            } else {
                newSet.delete(rowId);
            }

            if (onSelectionChange) {
                const allItems = Object.values(paginatedData).flat();
                const selectedRowData = allItems.filter(row => newSet.has(getRowId(row)));
                onSelectionChange(selectedRowData);
            }

            return newSet;
        });
    }, [paginatedData, getRowId, onSelectionChange]);

    const handleSelectAll = useCallback(() => {
        const allItems = Object.values(paginatedData).flat();
        const allIds = allItems.map(row => getRowId(row));
        const allSelected = allIds.every(id => selectedRows.has(id));

        if (allSelected) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(allIds));
        }
    }, [paginatedData, selectedRows, getRowId]);

    const handlePinItem = useCallback((rowId: string | number) => {
        setPinnedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    }, []);

    const handleToggleFavorite = useCallback((rowId: string | number) => {
        setFavorites(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
            } else {
                newSet.add(rowId);
            }
            return newSet;
        });
    }, []);

    const handleDeleteItem = useCallback((item: T) => {
        const rowId = getRowId(item);

        addUndoAction({
            id: String(rowId),
            type: 'delete',
            timestamp: new Date(),
            data: item,
            description: `Deleted ${item.name || `item ${rowId}`}`
        });

        setGridData(prev => prev.filter(row => getRowId(row) !== rowId));
    }, [getRowId, addUndoAction]);

    const handleBulkDelete = useCallback(() => {
        const allItems = Object.values(paginatedData).flat();
        const itemsToDelete = allItems.filter(row => selectedRows.has(getRowId(row)));

        if (itemsToDelete.length === 0) return;

        addUndoAction({
            id: Date.now().toString(),
            type: 'bulk-delete',
            timestamp: new Date(),
            data: itemsToDelete,
            description: `Deleted ${itemsToDelete.length} items`
        });

        const idsToDelete = new Set(itemsToDelete.map(item => getRowId(item)));
        setGridData(prev => prev.filter(row => !idsToDelete.has(getRowId(row))));
        setSelectedRows(new Set());
    }, [paginatedData, selectedRows, getRowId, addUndoAction]);

    // Context menu positioning within card bounds
    const handleContextMenu = useCallback((e: React.MouseEvent, item: T) => {
        if (!enableContextMenu) return;

        e.preventDefault();
        e.stopPropagation();

        const card = e.currentTarget as HTMLElement;
        const cardRect = card.getBoundingClientRect();

        // Calculate position relative to the card and mouse position
        let x = e.clientX;
        let y = e.clientY;

        // Ensure context menu stays within viewport and close to click
        const menuWidth = 200;
        const menuHeight = 250;

        // Adjust horizontal position
        if (x + menuWidth > window.innerWidth) {
            x = x - menuWidth;
        }
        if (x < 0) {
            x = 10;
        }

        // Adjust vertical position
        if (y + menuHeight > window.innerHeight) {
            y = y - menuHeight;
        }
        if (y < 0) {
            y = 10;
        }

        // Ensure context menu is within card bounds for better UX
        const cardLeft = cardRect.left;
        const cardRight = cardRect.right;
        const cardTop = cardRect.top;
        const cardBottom = cardRect.bottom;

        // Clamp position to card boundaries
        x = Math.max(cardLeft + 10, Math.min(cardRight - menuWidth - 10, x));
        y = Math.max(cardTop + 10, Math.min(cardBottom - menuHeight - 10, y));

        setContextMenu({
            x,
            y,
            row: item,
            cardRef: card
        });
    }, [enableContextMenu]);

    // Grid API
    const gridApi: GridApi<T> = useMemo(() => ({
        refreshData: () => setGridData([...data]),
        exportData: (format: 'csv' | 'excel' | 'json') => console.log(`Exporting as ${format}`),
        selectAll: handleSelectAll,
        clearSelection: () => setSelectedRows(new Set()),
        getSelectedRows: () => {
            const allItems = Object.values(paginatedData).flat();
            return allItems.filter(row => selectedRows.has(getRowId(row)));
        },
        addRow: (row) => setGridData(prev => [...prev, row]),
        removeRow: (id) => setGridData(prev => prev.filter(row => getRowId(row) !== id)),
        updateRow: (id, updates) => setGridData(prev => prev.map(row =>
            getRowId(row) === id ? { ...row, ...updates } : row
        )),
        getColumnState: () => [],
        setColumnState: () => { },
        applyFilter: (columnId, filter) => setFilters(prev => ({ ...prev, [columnId]: filter })),
        clearFilters: () => setFilters({}),
        setSorting: (newSorting) => setSorting(newSorting),
        autoSizeColumns: () => { },
        exportToPDF: () => console.log('Exporting to PDF...')
    }), [data, handleSelectAll, paginatedData, selectedRows, getRowId]);

    // Get grid columns based on size
    const getGridColumns = () => {
        switch (gridSize) {
            case 'small': return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5';
            case 'medium': return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
            case 'large': return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
            default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className={cn("bg-black border border-white/10 rounded-xl p-6", className)}>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-64 bg-[#171717]" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 bg-[#171717]" />
                        <Skeleton className="h-10 w-24 bg-[#171717]" />
                    </div>
                </div>
                <div className={cn("grid gap-4", getGridColumns())}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 bg-[#171717] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("bg-black overflow-hidden", className)}>
            {/* Undo Notification */}
            <UndoNotification
                show={showUndoNotification}
                action={lastUndoAction}
                onUndo={handleUndo}
                onClose={() => setShowUndoNotification(false)}
            />

            {/* Enhanced Toolbar */}
            <Toolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                quickFilter={quickFilter}
                onQuickFilterChange={setQuickFilter}
                selectedRows={selectedRows}
                onBulkDelete={handleBulkDelete}
                enableBulkOperations={enableBulkOperations}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSettingsClick={() => setShowColumnManager(true)}
                enableExport={enableExport}
                gridApi={gridApi}
                onRefresh={() => gridApi.refreshData()}
                onKeyboardHelpClick={() => setShowKeyboardHelp(true)}
                onAdvancedFiltersClick={() => setShowFiltersModal(true)}
                customToolbar={customToolbar}
            />

            {/* Active Filters Display */}
            {(Object.keys(filters).length > 0 || sorting.length > 0 || selectedTags.length > 0 || selectedStatuses.length > 0) && (
                <div className="py-3 border-t border-white/10 bg-[#171717]/20">
                    <div className="flex items-center gap-3 flex-wrap">
                        {selectedTags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white/60">Tags:</span>
                                {selectedTags.map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-white/10 text-white border-white/20"
                                    >
                                        <Hash className="h-3 w-3 mr-1" />
                                        {tag}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-4 w-4 p-0 ml-1 text-white/60 hover:text-white"
                                            onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {selectedStatuses.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white/60">Status:</span>
                                {selectedStatuses.map(status => (
                                    <Badge
                                        key={status}
                                        variant="secondary"
                                        className="bg-white/10 text-white border-white/20"
                                    >
                                        {status}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-4 w-4 p-0 ml-1 text-white/60 hover:text-white"
                                            onClick={() => setSelectedStatuses(prev => prev.filter(s => s !== status))}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {sorting.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white/60">Sorted by:</span>
                                {sorting.map((sort) => {
                                    const column = columns.find(col => col.id === sort.columnId);
                                    return (
                                        <Badge
                                            key={sort.columnId}
                                            variant="secondary"
                                            className="bg-white/10 text-white border-white/20"
                                        >
                                            {column?.title}
                                            {sort.direction === 'asc' ? (
                                                <SortAsc className="h-3 w-3 ml-1" />
                                            ) : (
                                                <SortDesc className="h-3 w-3 ml-1" />
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-4 w-4 p-0 ml-1 text-white/60 hover:text-white"
                                                onClick={() => setSorting(prev => prev.filter(s => s.columnId !== sort.columnId))}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Grid Container */}
            <div ref={gridRef} className="">
                {/* Stats Bar */}
                <StatsBar
                    totalItems={Object.values(groupedData).flat().length}
                    pinnedCount={pinnedItems.size}
                    favoritesCount={favorites.size}
                    selectedCount={selectedRows.size}
                    highlightedCount={highlightedItems.size}
                    onSelectAll={enableRowSelection && enableMultiSelect ? handleSelectAll : undefined}
                    allSelected={Object.values(paginatedData).flat().length > 0 &&
                        Object.values(paginatedData).flat().every(row => selectedRows.has(getRowId(row)))}
                />

                {Object.values(paginatedData).flat().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-[#171717] rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Search className="h-10 w-10 text-white/40" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Items Found</h3>
                        <p className="text-white/60 max-w-md">
                            {searchQuery || Object.keys(filters).length > 0 || selectedTags.length > 0 || selectedStatuses.length > 0
                                ? 'Try adjusting your search or filter criteria'
                                : 'No data available to display'
                            }
                        </p>
                        {(searchQuery || Object.keys(filters).length > 0 || selectedTags.length > 0 || selectedStatuses.length > 0) && (
                            <Button
                                className="mt-4"
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilters({});
                                    setSelectedTags([]);
                                    setSelectedStatuses([]);
                                }}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(paginatedData).map(([groupName, items], groupIndex) => (
                            <div key={groupName}>
                                {/* Group Header */}
                                {groupBy !== 'none' && (
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-px bg-white/20 flex-1" />
                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#171717] border border-white/20 rounded-lg">
                                            {groupBy === 'department' && <Building className="h-4 w-4 text-white/60" />}
                                            {groupBy === 'status' && <Shield className="h-4 w-4 text-white/60" />}
                                            {groupBy === 'tags' && <Tags className="h-4 w-4 text-white/60" />}
                                            {groupBy === 'hireDate' && <Calendar className="h-4 w-4 text-white/60" />}
                                            <span className="text-white font-medium">{groupName}</span>
                                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 ml-2">
                                                {items.length}
                                            </Badge>
                                        </div>
                                        <div className="h-px bg-white/20 flex-1" />
                                    </div>
                                )}

                                {/* Group Items */}
                                <div className={cn(
                                    viewMode === 'compact' ? "space-y-3" : `grid gap-6 ${getGridColumns()}`
                                )}>
                                    {items.map((item, index) => (
                                        <ItemCard
                                            key={getRowId(item)}
                                            item={item}
                                            index={index + groupIndex * 10}
                                            rowId={getRowId(item)}
                                            viewMode={viewMode}
                                            gridSize={gridSize}
                                            isSelected={selectedRows.has(getRowId(item))}
                                            isPinned={pinnedItems.has(getRowId(item))}
                                            isFavorite={favorites.has(getRowId(item))}
                                            isHighlighted={highlightedItems.has(getRowId(item))}
                                            enableRowSelection={enableRowSelection}
                                            searchQuery={searchQuery}
                                            onSelectionChange={handleRowSelection}
                                            onToggleFavorite={handleToggleFavorite}
                                            onPinItem={handlePinItem}
                                            onPreview={(item) => {
                                                setPreviewItem(item);
                                                setShowPreview(true);
                                            }}
                                            onClick={(e) => onRowClick?.(item, e)}
                                            onDoubleClick={(e) => {
                                                onRowDoubleClick?.(item, e);
                                                setPreviewItem(item);
                                                setShowPreview(true);
                                            }}
                                            onContextMenu={(e) => handleContextMenu(e, item)}
                                            onHover={setHoveredCard}

                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={currentPageSize}
                    totalItems={Object.values(groupedData).flat().length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setCurrentPageSize(size);
                        setCurrentPage(1);
                    }}
                />
            )}

            {/* Preview Modal */}
            <PreviewModal
                isOpen={showPreview}
                item={previewItem}
                getRowId={getRowId}
                favorites={favorites}
                pinnedItems={pinnedItems}
                onClose={() => setShowPreview(false)}
                onToggleFavorite={handleToggleFavorite}
                onPinItem={handlePinItem}
            />

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showColumnManager}
                viewMode={viewMode}
                gridSize={gridSize}
                onViewModeChange={setViewMode}
                onGridSizeChange={setGridSize}
                onClose={() => setShowColumnManager(false)}
            />

            {/* Filter Modal */}
            <FilterModal
                isOpen={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                allTags={allTags}
                allStatuses={allStatuses}
                selectedTags={selectedTags}
                selectedStatuses={selectedStatuses}
                onTagsChange={setSelectedTags}
                onStatusesChange={setSelectedStatuses}
                columns={columns}
                filters={filters}
                onFiltersChange={setFilters}
                sorting={sorting}
                onSortingChange={setSorting}
            />

            {/* Keyboard Help Modal */}
            <KeyboardHelpModal
                isOpen={showKeyboardHelp}
                onClose={() => setShowKeyboardHelp(false)}
            />

            {/* Context Menu */}
            <ContextMenu
                contextMenu={contextMenu}
                contextMenuRef={contextMenuRef}
                favorites={favorites}
                pinnedItems={pinnedItems}
                enableInlineEditing={enableInlineEditing}
                getRowId={getRowId}
                onClose={() => setContextMenu(null)}
                onPreview={(item) => {
                    setPreviewItem(item);
                    setShowPreview(true);
                }}
                onCopyData={(item) => {
                    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
                }}
                onToggleFavorite={handleToggleFavorite}
                onPinItem={handlePinItem}
                onDeleteItem={handleDeleteItem}
            />

            {customFooter}
        </div>
    );
};

export default DataGrid;