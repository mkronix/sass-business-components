import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Briefcase,
    Building,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Copy,
    DollarSign,
    Download,
    Edit2,
    Eye,
    FilterX,
    Grid3X3,
    List,
    Mail,
    Phone,
    Pin,
    RefreshCw,
    Search,
    Settings,
    SortAsc,
    SortDesc,
    Trash2,
    TrendingUp,
    User,
    X,
    Zap,
    Star,
    History,
    Group,
    Hash,
    Clock,
    Heart,
    Undo2,
    Command,
    ChevronDown,
    ChevronUp,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RotateCcw,
    Keyboard,
    Filter,
    Tags
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { DataGridProps, FilterConfig, GridApi, SortConfig } from './types';

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
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row?: T; cardRef?: HTMLElement } | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [gridSize, setGridSize] = useState<GridSize>('medium');
    const [pinnedItems, setPinnedItems] = useState<Set<string | number>>(new Set());

    // New enhanced features state
    const [groupBy, setGroupBy] = useState<GroupBy>('none');
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
    const [previewItem, setPreviewItem] = useState<T | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [undoHistory, setUndoHistory] = useState<UndoAction[]>([]);
    const [showUndoNotification, setShowUndoNotification] = useState(false);
    const [lastUndoAction, setLastUndoAction] = useState<UndoAction | null>(null);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [highlightedItems, setHighlightedItems] = useState<Set<string | number>>(new Set());
    const [showFilters, setShowFilters] = useState(false);

    // Refs
    const gridRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

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
            // F - Toggle filters
            else if (e.key === 'f' && !cmdKey) {
                e.preventDefault();
                setShowFilters(prev => !prev);
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

    // Handle search highlighting separately to avoid infinite re-renders
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

    // Get unique values for filters
    const getUniqueValues = (field: string) => {
        return [...new Set(gridData.map(item => item[field]).filter(Boolean))];
    };

    const allTags = useMemo(() => {
        return [...new Set(gridData.flatMap(item => item.tags || []))];
    }, [gridData]);

    const allStatuses = useMemo(() => {
        return getUniqueValues('status');
    }, [gridData]);

    // Undo functionality
    const addUndoAction = useCallback((action: UndoAction) => {
        setUndoHistory(prev => [...prev.slice(-9), action]); // Keep last 10 actions
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

    // Enhanced data processing with grouping and advanced filters
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
                const matches = columns.some(col => {
                    const value = row[col.field];
                    const stringValue = String(value || '').toLowerCase();
                    return stringValue.includes(query);
                });
                return matches;
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
                        // Group by primary tag (first tag)
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

        // Sort groups alphabetically
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

        // Re-group paginated items
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

        // Add to undo history
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

        // Add to undo history
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

        // Calculate position relative to the card
        let x = e.clientX;
        let y = e.clientY;

        // Ensure context menu stays within card bounds
        const menuWidth = 200; // Approximate context menu width
        const menuHeight = 250; // Approximate context menu height

        if (x + menuWidth > cardRect.right) {
            x = cardRect.right - menuWidth - 10;
        }
        if (x < cardRect.left) {
            x = cardRect.left + 10;
        }

        if (y + menuHeight > cardRect.bottom) {
            y = cardRect.bottom - menuHeight - 10;
        }
        if (y < cardRect.top) {
            y = cardRect.top + 10;
        }

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

    // Highlight search terms in text
    const highlightText = (text: string, query: string) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={index} className="bg-yellow-400/30 text-yellow-200 rounded px-1">{part}</mark> :
                part
        );
    };

    // Render item card based on view mode
    const renderItemCard = (item: T, index: number) => {
        const rowId = getRowId(item);
        const isSelected = selectedRows.has(rowId);
        const isPinned = pinnedItems.has(rowId);
        const isFavorite = favorites.has(rowId);
        const isHovered = hoveredCard === rowId;
        const isHighlighted = highlightedItems.has(rowId);

        const cardVariants = {
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring" as const,
                    stiffness: 260,
                    damping: 20
                }
            },
            hover: {
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2 }
            },
            selected: {
                scale: 1.03,
                boxShadow: "0 0 0 2px #ffffff, 0 8px 25px rgba(255, 255, 255, 0.15)",
                transition: { duration: 0.2 }
            }
        };

        if (viewMode === 'compact') {
            return (
                <motion.div
                    key={rowId}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isSelected ? "selected" : "visible"}
                    whileHover="hover"
                    className={cn(
                        "flex items-center gap-4 p-4 bg-[#171717] border border-white/10 rounded-lg cursor-pointer relative group overflow-hidden",
                        isSelected && "border-white/30 bg-[#171717]/80",
                        isPinned && "ring-1 ring-white/20",
                        isHighlighted && "ring-2 ring-yellow-400/50 border-yellow-400/30",
                        isFavorite && "ring-1 ring-red-400/30"
                    )}
                    onMouseEnter={() => setHoveredCard(rowId)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={(e) => onRowClick?.(item, e)}
                    onDoubleClick={(e) => {
                        onRowDoubleClick?.(item, e);
                        setPreviewItem(item);
                        setShowPreview(true);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                >
                    {/* Selection overlay */}
                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white/5 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    {/* Pin indicator */}
                    {isPinned && (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}

                    {/* Favorite indicator */}
                    {isFavorite && (
                        <div className="absolute top-2 right-2 text-red-400">
                            <Heart className="h-3 w-3 fill-current" />
                        </div>
                    )}

                    {/* Selection checkbox */}
                    {enableRowSelection && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: isHovered || isSelected ? 1 : 0.6, scale: 1 }}
                            className="flex-shrink-0"
                        >
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleRowSelection(rowId, checked as boolean)}
                                className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white"
                            />
                        </motion.div>
                    )}

                    {/* Avatar/Icon */}
                    <div className="flex-shrink-0">
                        {item.avatar ? (
                            <img
                                src={item.avatar}
                                alt={item.name || 'Avatar'}
                                className="w-10 h-10 rounded-full border border-white/20"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white/70" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white truncate">
                                {searchQuery ? highlightText(item.name || `Item ${rowId}`, searchQuery) : (item.name || `Item ${rowId}`)}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="ml-2 bg-white/10 text-white border-white/20"
                                >
                                    {item.status || 'Active'}
                                </Badge>
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        {item.tags.slice(0, 2).map((tag: string) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs bg-white/5 border-white/20 text-white/70"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                        {item.tags.length > 2 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-white/5 border-white/20 text-white/70"
                                            >
                                                +{item.tags.length - 2}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-white/60 truncate mt-1">
                            {searchQuery ? highlightText(item.email || item.department || 'No description', searchQuery) : (item.email || item.department || 'No description')}
                        </p>
                    </div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                        className="flex items-center gap-1"
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(rowId);
                            }}
                        >
                            <Heart className={cn("h-4 w-4", isFavorite && "fill-red-400 text-red-400")} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePinItem(rowId);
                            }}
                        >
                            <Pin className={cn("h-4 w-4", isPinned && "fill-white")} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                                setShowPreview(true);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </motion.div>
            );
        }

        // Grid card view
        return (
            <motion.div
                key={rowId}
                variants={cardVariants}
                initial="hidden"
                animate={isSelected ? "selected" : "visible"}
                whileHover="hover"
                className={cn(
                    "bg-[#171717] border border-white/10 rounded-xl p-6 cursor-pointer relative group overflow-hidden",
                    "hover:border-white/30 transition-all duration-300",
                    isSelected && "border-white/50 bg-[#171717]/90 shadow-xl shadow-white/10",
                    isPinned && "ring-1 ring-white/30",
                    isHighlighted && "ring-2 ring-yellow-400/50 border-yellow-400/30",
                    isFavorite && "ring-1 ring-red-400/30",
                    gridSize === 'large' && "p-8"
                )}
                onMouseEnter={() => setHoveredCard(rowId)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={(e) => onRowClick?.(item, e)}
                onDoubleClick={(e) => {
                    onRowDoubleClick?.(item, e);
                    setPreviewItem(item);
                    setShowPreview(true);
                }}
                onContextMenu={(e) => handleContextMenu(e, item)}
            >
                {/* Background glow effect */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                />

                {/* Selection overlay */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 bg-white/5 rounded-xl border border-white/20 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Pin indicator */}
                {isPinned && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full"
                    />
                )}

                {/* Favorite indicator */}
                {isFavorite && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-8 text-red-400"
                    >
                        <Heart className="h-4 w-4 fill-current" />
                    </motion.div>
                )}

                {/* Selection checkbox */}
                {enableRowSelection && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isHovered || isSelected ? 1 : 0, scale: 1 }}
                        className="absolute top-3 left-3"
                    >
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleRowSelection(rowId, checked as boolean)}
                            className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:border-white"
                        />
                    </motion.div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {item.avatar ? (
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={item.avatar}
                                alt={item.name || 'Avatar'}
                                className="w-12 h-12 rounded-full border-2 border-white/20"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                                <User className="h-6 w-6 text-white/70" />
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-white text-lg leading-tight">
                                {searchQuery ? highlightText(item.name || `Item ${rowId}`, searchQuery) : (item.name || `Item ${rowId}`)}
                            </h3>
                            <p className="text-sm text-white/60">
                                #{rowId}
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: isHovered ? 1 : 0, rotate: 0 }}
                        className="flex gap-1"
                    >
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(rowId);
                            }}
                        >
                            <Heart className={cn("h-4 w-4", isFavorite && "fill-red-400 text-red-400")} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePinItem(rowId);
                            }}
                        >
                            <Pin className={cn("h-4 w-4", isPinned && "fill-white")} />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                                setShowPreview(true);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map((tag: string) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                            >
                                <Hash className="h-3 w-3 mr-1" />
                                {tag}
                            </Badge>
                        ))}
                        {item.tags.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs bg-white/5 border-white/20 text-white/70"
                            >
                                +{item.tags.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Content Grid */}
                <div className="space-y-4">
                    {/* Status and metrics */}
                    <div className="flex items-center justify-between">
                        <Badge
                            variant={item.status === 'Active' ? 'default' : 'secondary'}
                            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        >
                            {item.status || 'Active'}
                        </Badge>
                        {item.performance && (
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-white/60" />
                                <span className="text-sm text-white/80">{item.performance}%</span>
                            </div>
                        )}
                    </div>

                    {/* Key details */}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        {item.department && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Building className="h-4 w-4" />
                                <span>{searchQuery ? highlightText(item.department, searchQuery) : item.department}</span>
                            </div>
                        )}
                        {item.role && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Briefcase className="h-4 w-4" />
                                <span>{searchQuery ? highlightText(item.role, searchQuery) : item.role}</span>
                            </div>
                        )}
                        {item.email && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">
                                    {searchQuery ? highlightText(item.email, searchQuery) : item.email}
                                </span>
                            </div>
                        )}
                        {item.phoneNumber && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Phone className="h-4 w-4" />
                                <span>{item.phoneNumber}</span>
                            </div>
                        )}
                        {item.salary && (
                            <div className="flex items-center gap-2 text-white/70">
                                <DollarSign className="h-4 w-4" />
                                <span>${item.salary.toLocaleString()}</span>
                            </div>
                        )}
                        {item.hireDate && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(item.hireDate).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
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
        <div className={cn("bg-black border border-white/10 rounded-xl overflow-hidden", className)}>
            {/* Undo Notification */}
            <AnimatePresence>
                {showUndoNotification && lastUndoAction && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#171717] border border-white/20 rounded-lg px-4 py-3 flex items-center gap-3 shadow-xl"
                    >
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white text-sm">{lastUndoAction.description}</span>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleUndo}
                            className="ml-2 border-white/20 text-white hover:bg-white/10"
                        >
                            <Undo2 className="h-4 w-4 mr-1" />
                            Undo
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowUndoNotification(false)}
                            className="text-white/60 hover:text-white hover:bg-white/10 p-1"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Toolbar */}
            <div className="p-6 border-b border-white/10 bg-[#171717]/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-72 bg-[#171717] border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            />
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-2">
                            {(['all', 'recent', 'pinned', 'favorites', 'active', 'inactive'] as QuickFilter[]).map(filter => (
                                <Button
                                    key={filter}
                                    size="sm"
                                    variant={quickFilter === filter ? 'default' : 'ghost'}
                                    className={cn(
                                        "h-8 px-3 text-xs",
                                        quickFilter === filter
                                            ? 'bg-white text-black'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                    )}
                                    onClick={() => setQuickFilter(filter)}
                                >
                                    {filter === 'recent' && <Clock className="h-3 w-3 mr-1" />}
                                    {filter === 'pinned' && <Pin className="h-3 w-3 mr-1" />}
                                    {filter === 'favorites' && <Heart className="h-3 w-3 mr-1" />}
                                    {filter === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {filter === 'inactive' && <XCircle className="h-3 w-3 mr-1" />}
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </Button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedRows.size > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-2"
                                >
                                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 rounded-md w-max py-[6px] text-base">
                                        <Zap className="h-4 w-4 mr-1" />
                                        {selectedRows.size} selected
                                    </Badge>
                                    {enableBulkOperations && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-white/20 text-white hover:bg-white/10"
                                            onClick={handleBulkDelete}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        {customToolbar}

                        {/* Grouping controls */}
                        <Select value={groupBy} onValueChange={(value: GroupBy) => setGroupBy(value)}>
                            <SelectTrigger className="w-36 bg-[#171717] border-white/20 text-white">
                                <Group className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Group by" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-white/20">
                                <SelectItem value="none" className="text-white">No Grouping</SelectItem>
                                <SelectItem value="department" className="text-white">Department</SelectItem>
                                <SelectItem value="status" className="text-white">Status</SelectItem>
                                <SelectItem value="tags" className="text-white">Tags</SelectItem>
                                <SelectItem value="hireDate" className="text-white">Hire Date</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Advanced Filters Toggle */}
                        <Button
                            size="sm"
                            variant={showFilters ? 'default' : 'outline'}
                            className={cn(
                                showFilters
                                    ? 'bg-white text-black'
                                    : 'border-white/20 text-white hover:bg-white/10'
                            )}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4 mr-1" />
                            Filters
                        </Button>

                        {/* View mode switcher */}
                        <div className="flex items-center bg-[#171717] border border-white/20 rounded-lg p-1">
                            <Button
                                size="sm"
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                className={cn(
                                    "h-8 px-3",
                                    viewMode === 'grid' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                                className={cn(
                                    "h-8 px-3",
                                    viewMode === 'compact' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                                onClick={() => setViewMode('compact')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => setShowColumnManager(true)}
                        >
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                        </Button>

                        {enableExport && (
                            <Select onValueChange={(format) => gridApi.exportData(format as any)}>
                                <SelectTrigger className="w-32 bg-[#171717] border-white/20 text-white">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-white/20">
                                    <SelectItem value="csv" className="text-white">CSV</SelectItem>
                                    <SelectItem value="excel" className="text-white">Excel</SelectItem>
                                    <SelectItem value="json" className="text-white">JSON</SelectItem>
                                </SelectContent>
                            </Select>
                        )}

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => gridApi.refreshData()}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>

                        {/* Keyboard shortcuts help */}
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/60 hover:text-white hover:bg-white/10"
                            onClick={() => setShowKeyboardHelp(true)}
                        >
                            <Keyboard className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>


            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-white/10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Tag filters */}
                            {allTags.length > 0 && (
                                <div>
                                    <label className="text-sm text-white/70 mb-2 block">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.slice(0, 6).map(tag => (
                                            <Button
                                                key={tag}
                                                size="sm"
                                                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                                                className={cn(
                                                    "h-7 px-2 text-xs",
                                                    selectedTags.includes(tag)
                                                        ? 'bg-white text-black'
                                                        : 'border-white/20 text-white hover:bg-white/10'
                                                )}
                                                onClick={() => {
                                                    setSelectedTags(prev =>
                                                        prev.includes(tag)
                                                            ? prev.filter(t => t !== tag)
                                                            : [...prev, tag]
                                                    );
                                                }}
                                            >
                                                <Hash className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Button>
                                        ))}
                                        {allTags.length > 6 && (
                                            <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                                                +{allTags.length - 6} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Status filters */}
                            <div>
                                <label className="text-sm text-white/70 mb-2 block">Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {allStatuses.map(status => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
                                            className={cn(
                                                "h-7 px-2 text-xs",
                                                selectedStatuses.includes(status)
                                                    ? 'bg-white text-black'
                                                    : 'border-white/20 text-white hover:bg-white/10'
                                            )}
                                            onClick={() => {
                                                setSelectedStatuses(prev =>
                                                    prev.includes(status)
                                                        ? prev.filter(s => s !== status)
                                                        : [...prev, status]
                                                );
                                            }}
                                        >
                                            {status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                                            {status === 'Inactive' && <XCircle className="h-3 w-3 mr-1" />}
                                            {status === 'On Leave' && <Clock className="h-3 w-3 mr-1" />}
                                            {status === 'Pending' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear filters */}
                            <div className="flex items-end">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10"
                                    onClick={() => {
                                        setSelectedTags([]);
                                        setSelectedStatuses([]);
                                        setFilters({});
                                    }}
                                >
                                    <FilterX className="h-4 w-4 mr-1" />
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active filters display */}
            <AnimatePresence>
                {(Object.keys(filters).length > 0 || sorting.length > 0 || selectedTags.length > 0 || selectedStatuses.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 pt-4 border-t border-white/10"
                    >
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

                        {Object.keys(filters).length > 0 && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                                onClick={() => setFilters({})}
                            >
                                <FilterX className="h-4 w-4 mr-1" />
                                Clear Filters ({Object.keys(filters).length})
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Grid Container */}
            <div ref={gridRef} className="p-6">
                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6 text-sm text-white/60"
                >
                    <div className="flex items-center gap-4">
                        <span>
                            {Object.values(groupedData).flat().length} items total
                        </span>
                        {pinnedItems.size > 0 && (
                            <span>• {pinnedItems.size} pinned</span>
                        )}
                        {favorites.size > 0 && (
                            <span>• {favorites.size} favorites</span>
                        )}
                        {selectedRows.size > 0 && (
                            <span className="text-white font-medium">• {selectedRows.size} selected</span>
                        )}
                        {highlightedItems.size > 0 && (
                            <span className="text-yellow-400 font-medium">• {highlightedItems.size} highlighted</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {enableRowSelection && enableMultiSelect && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                                onClick={handleSelectAll}
                            >
                                {Object.values(paginatedData).flat().length > 0 &&
                                    Object.values(paginatedData).flat().every(row => selectedRows.has(getRowId(row))) ? 'Deselect All' : 'Select All'}
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Grouped Grid/List View */}
                <AnimatePresence mode="wait">
                    {Object.values(paginatedData).flat().length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-20 h-20 bg-[#171717] rounded-full flex items-center justify-center mb-6 border border-white/10"
                            >
                                <Search className="h-10 w-10 text-white/40" />
                            </motion.div>
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
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(paginatedData).map(([groupName, items], groupIndex) => (
                                <motion.div
                                    key={groupName}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
                                >
                                    {/* Group Header */}
                                    {groupBy !== 'none' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-3 mb-4"
                                        >
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
                                        </motion.div>
                                    )}

                                    {/* Group Items */}
                                    <motion.div
                                        className={cn(
                                            viewMode === 'compact' ? "space-y-3" : `grid gap-6 ${getGridColumns()}`
                                        )}
                                    >
                                        {items.map((item, index) => renderItemCard(item, index + groupIndex * 10))}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Enhanced Pagination */}
            {
                pagination && totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-6 border-t border-white/10 bg-[#171717]/20"
                    >
                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>
                                Showing {((currentPage - 1) * currentPageSize) + 1} to{' '}
                                {Math.min(currentPage * currentPageSize, Object.values(groupedData).flat().length)} of{' '}
                                {Object.values(groupedData).flat().length} items
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Select
                                value={String(currentPageSize)}
                                onValueChange={(value) => {
                                    setCurrentPageSize(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-24 bg-[#171717] border-white/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-white/20">
                                    <SelectItem value="25" className="text-white">25</SelectItem>
                                    <SelectItem value="50" className="text-white">50</SelectItem>
                                    <SelectItem value="100" className="text-white">100</SelectItem>
                                    <SelectItem value="200" className="text-white">200</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
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
                                                onClick={() => setCurrentPage(page)}
                                                className={cn(
                                                    "w-10 h-10",
                                                    currentPage === page
                                                        ? "bg-white text-black"
                                                        : "border-white/20 text-white hover:bg-white/10"
                                                )}
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
                                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )
            }

            {/* Preview Modal (Bottom Drawer) */}
            <AnimatePresence>
                {showPreview && previewItem && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setShowPreview(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[#171717] border-t border-white/20 rounded-t-2xl z-50 max-h-[80vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    {previewItem.avatar ? (
                                        <img
                                            src={previewItem.avatar}
                                            alt={previewItem.name || 'Avatar'}
                                            className="w-12 h-12 rounded-full border-2 border-white/20"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                                            <User className="h-6 w-6 text-white/70" />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">
                                            {previewItem.name || `Item ${getRowId(previewItem)}`}
                                        </h2>
                                        <p className="text-sm text-white/60">#{getRowId(previewItem)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white/70 hover:text-white hover:bg-white/10"
                                        onClick={() => handleToggleFavorite(getRowId(previewItem))}
                                    >
                                        <Heart className={cn("h-4 w-4", favorites.has(getRowId(previewItem)) && "fill-red-400 text-red-400")} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white/70 hover:text-white hover:bg-white/10"
                                        onClick={() => handlePinItem(getRowId(previewItem))}
                                    >
                                        <Pin className={cn("h-4 w-4", pinnedItems.has(getRowId(previewItem)) && "fill-white")} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white/70 hover:text-white hover:bg-white/10"
                                        onClick={() => setShowPreview(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Basic Information</h3>
                                        <div className="space-y-3">
                                            {previewItem.email && (
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">{previewItem.email}</span>
                                                </div>
                                            )}
                                            {previewItem.phoneNumber && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">{previewItem.phoneNumber}</span>
                                                </div>
                                            )}
                                            {previewItem.department && (
                                                <div className="flex items-center gap-3">
                                                    <Building className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">{previewItem.department}</span>
                                                </div>
                                            )}
                                            {previewItem.role && (
                                                <div className="flex items-center gap-3">
                                                    <Briefcase className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">{previewItem.role}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Employment Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Employment</h3>
                                        <div className="space-y-3">
                                            {previewItem.salary && (
                                                <div className="flex items-center gap-3">
                                                    <DollarSign className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">${previewItem.salary.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {previewItem.hireDate && (
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">{new Date(previewItem.hireDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {previewItem.performance && (
                                                <div className="flex items-center gap-3">
                                                    <TrendingUp className="h-4 w-4 text-white/60" />
                                                    <span className="text-white/80">{previewItem.performance}% Performance</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={previewItem.status === 'Active' ? 'default' : 'secondary'}
                                                    className="bg-white/10 text-white border-white/20"
                                                >
                                                    {previewItem.status || 'Active'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags & Skills */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Tags & Skills</h3>
                                        {previewItem.tags && previewItem.tags.length > 0 && (
                                            <div>
                                                <h4 className="text-sm text-white/70 mb-2">Tags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {previewItem.tags.map((tag: string) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="outline"
                                                            className="bg-white/5 border-white/20 text-white/70"
                                                        >
                                                            <Hash className="h-3 w-3 mr-1" />
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {previewItem.skills && previewItem.skills.length > 0 && (
                                            <div>
                                                <h4 className="text-sm text-white/70 mb-2">Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {previewItem.skills.map((skill: string) => (
                                                        <Badge
                                                            key={skill}
                                                            variant="secondary"
                                                            className="bg-white/10 text-white border-white/20"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {previewItem.bio && (
                                            <div>
                                                <h4 className="text-sm text-white/70 mb-2">Bio</h4>
                                                <p className="text-white/80 text-sm">{previewItem.bio}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Settings Dialog */}
            <AnimatePresence>
                {showColumnManager && (
                    <Dialog open={showColumnManager} onOpenChange={setShowColumnManager}>
                        <DialogContent className="max-w-2xl bg-[#171717] border-white/20 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white">Grid Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                {/* View Options */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-white">Display Options</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-white/70 mb-2 block">View Mode</label>
                                            <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                                                <SelectTrigger className="bg-black border-white/20 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#171717] border-white/20">
                                                    <SelectItem value="grid" className="text-white">Grid View</SelectItem>
                                                    <SelectItem value="compact" className="text-white">Compact List</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm text-white/70 mb-2 block">Grid Size</label>
                                            <Select value={gridSize} onValueChange={(value: GridSize) => setGridSize(value)}>
                                                <SelectTrigger className="bg-black border-white/20 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#171717] border-white/20">
                                                    <SelectItem value="small" className="text-white">Small Cards</SelectItem>
                                                    <SelectItem value="medium" className="text-white">Medium Cards</SelectItem>
                                                    <SelectItem value="large" className="text-white">Large Cards</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showKeyboardHelp && (
                    <Dialog open={showKeyboardHelp} onOpenChange={setShowKeyboardHelp}>
                        <DialogContent className="max-w-2xl bg-[#171717] border-white/20 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                    <Keyboard className="h-5 w-5" />
                                    Keyboard Shortcuts
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-white mb-3">Navigation</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Search</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+F</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Select All</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+A</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Escape Selection</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Esc</kbd>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-3">Actions</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Undo</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+Z</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Toggle Grouping</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">G</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Toggle Filters</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">F</kbd>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-3">View Modes</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Grid View</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">1</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Compact View</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">2</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Small Cards</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">3</kbd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Large Cards</span>
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">4</kbd>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-3">Help</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">?</kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* Enhanced Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        ref={contextMenuRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 bg-[#171717] border border-white/20 rounded-lg shadow-xl py-2 min-w-48"
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                            maxWidth: contextMenu.cardRef ?
                                Math.min(200, contextMenu.cardRef.getBoundingClientRect().width - 20) : 200
                        }}
                        onBlur={() => setContextMenu(null)}
                        tabIndex={-1}
                    >
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    setPreviewItem(contextMenu.row);
                                    setShowPreview(true);
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    navigator.clipboard.writeText(JSON.stringify(contextMenu.row, null, 2));
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Copy className="h-4 w-4" />
                            Copy Data
                        </button>
                        <Separator className="my-1 bg-white/10" />
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    const rowId = getRowId(contextMenu.row);
                                    handleToggleFavorite(rowId);
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Heart className={cn(
                                "h-4 w-4",
                                contextMenu.row && favorites.has(getRowId(contextMenu.row)) && "fill-red-400 text-red-400"
                            )} />
                            {contextMenu.row && favorites.has(getRowId(contextMenu.row)) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    const rowId = getRowId(contextMenu.row);
                                    handlePinItem(rowId);
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Pin className="h-4 w-4" />
                            {contextMenu.row && pinnedItems.has(getRowId(contextMenu.row)) ? 'Unpin Item' : 'Pin Item'}
                        </button>
                        {enableInlineEditing && (
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Item
                            </button>
                        )}
                        <Separator className="my-1 bg-white/10" />
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    handleDeleteItem(contextMenu.row);
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Item
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Footer */}
            {customFooter}
        </div >
    );
};

export default DataGrid;