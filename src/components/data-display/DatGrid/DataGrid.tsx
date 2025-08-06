
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    ArrowUpDown,
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Edit2,
    Filter,
    FilterX,
    Grid3X3,
    List,
    MoreHorizontal,
    Pin,
    RefreshCw,
    Search,
    Settings,
    SortAsc,
    SortDesc,
    Trash2,
    X,
    Zap,
    Eye,
    Calendar,
    DollarSign,
    User,
    Phone,
    Mail,
    Building,
    Briefcase,
    TrendingUp,
    Clock,
    Star,
    Tag,
    Group,
    Undo,
    Keyboard,
    Heart,
    Plus
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CellRendererParams, DataGridProps, FilterConfig, GridApi, GridColumn, SortConfig } from './types';

type ViewMode = 'grid' | 'compact' | 'cards';
type GridSize = 'small' | 'medium' | 'large';
type GroupBy = 'none' | 'tags' | 'category' | 'date' | 'status';

interface UndoAction {
    type: 'delete' | 'edit' | 'bulk_delete';
    data: any;
    timestamp: number;
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
    const [editingCell, setEditingCell] = useState<{ rowId: string | number; field: string } | null>(null);
    const [editValue, setEditValue] = useState<any>('');
    const [sorting, setSorting] = useState<SortConfig[]>([]);
    const [filters, setFilters] = useState<Record<string, FilterConfig>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(pageSize);
    const [searchQuery, setSearchQuery] = useState('');
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row?: T } | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [gridSize, setGridSize] = useState<GridSize>('medium');
    const [pinnedItems, setPinnedItems] = useState<Set<string | number>>(new Set());
    
    // New state for enhanced features
    const [tagFilters, setTagFilters] = useState<Set<string>>(new Set());
    const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());
    const [groupBy, setGroupBy] = useState<GroupBy>('none');
    const [quickFilter, setQuickFilter] = useState<string>('all');
    const [previewItem, setPreviewItem] = useState<T | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
    const [highlightedText, setHighlightedText] = useState<string>('');
    const [favorites, setFavorites] = useState<Set<string | number>>(new Set());

    // Refs
    const gridRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        handleUndo();
                        break;
                    case 'a':
                        e.preventDefault();
                        handleSelectAll();
                        break;
                    case 'f':
                        e.preventDefault();
                        document.querySelector('input[placeholder*="Search"]')?.focus();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                setContextMenu(null);
                setShowPreview(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [undoStack]);

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setContextMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get available tags and statuses
    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        gridData.forEach(item => {
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach((tag: string) => tags.add(tag));
            }
        });
        return Array.from(tags);
    }, [gridData]);

    const availableStatuses = useMemo(() => {
        const statuses = new Set<string>();
        gridData.forEach(item => {
            if (item.status) {
                statuses.add(item.status);
            }
        });
        return Array.from(statuses);
    }, [gridData]);

    // Enhanced data processing with new filters
    const processedData = useMemo(() => {
        let result = [...gridData];

        // Apply quick filters
        switch (quickFilter) {
            case 'pinned':
                result = result.filter(row => pinnedItems.has(getRowId(row)));
                break;
            case 'favorites':
                result = result.filter(row => favorites.has(getRowId(row)));
                break;
            case 'recent':
                result = result.filter(row => {
                    const date = new Date(row.createdAt || row.updatedAt || 0);
                    const daysDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 7;
                });
                break;
        }

        // Apply tag filters
        if (tagFilters.size > 0) {
            result = result.filter(row => {
                if (!row.tags || !Array.isArray(row.tags)) return false;
                return Array.from(tagFilters).some(tag => row.tags.includes(tag));
            });
        }

        // Apply status filters
        if (statusFilters.size > 0) {
            result = result.filter(row => statusFilters.has(row.status));
        }

        // Apply global search with highlighting
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            setHighlightedText(searchQuery);
            result = result.filter(row =>
                columns.some(col => {
                    const value = row[col.field];
                    return String(value || '').toLowerCase().includes(query);
                })
            );
        } else {
            setHighlightedText('');
        }

        // Apply existing filters
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
    }, [gridData, searchQuery, filters, sorting, columns, pinnedItems, getRowId, tagFilters, statusFilters, quickFilter, favorites]);

    // Group processed data
    const groupedData = useMemo(() => {
        if (groupBy === 'none') {
            return { 'All Items': processedData };
        }

        const groups: Record<string, T[]> = {};

        processedData.forEach(item => {
            let groupKey = 'Other';

            switch (groupBy) {
                case 'status':
                    groupKey = item.status || 'No Status';
                    break;
                case 'category':
                    groupKey = item.category || 'No Category';
                    break;
                case 'tags':
                    groupKey = item.tags?.[0] || 'No Tags';
                    break;
                case 'date':
                    const date = new Date(item.createdAt || item.updatedAt || 0);
                    groupKey = date.toISOString().split('T')[0];
                    break;
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        return groups;
    }, [processedData, groupBy]);

    // Pagination
    const paginatedGroups = useMemo(() => {
        if (!pagination) return groupedData;
        
        const allItems = Object.values(groupedData).flat();
        const start = (currentPage - 1) * currentPageSize;
        const paginatedItems = allItems.slice(start, start + currentPageSize);
        
        if (groupBy === 'none') {
            return { 'All Items': paginatedItems };
        }

        // Rebuild groups with paginated items
        const newGroups: Record<string, T[]> = {};
        paginatedItems.forEach(item => {
            let groupKey = 'Other';
            switch (groupBy) {
                case 'status':
                    groupKey = item.status || 'No Status';
                    break;
                case 'category':
                    groupKey = item.category || 'No Category';
                    break;
                case 'tags':
                    groupKey = item.tags?.[0] || 'No Tags';
                    break;
                case 'date':
                    const date = new Date(item.createdAt || item.updatedAt || 0);
                    groupKey = date.toISOString().split('T')[0];
                    break;
            }
            if (!newGroups[groupKey]) {
                newGroups[groupKey] = [];
            }
            newGroups[groupKey].push(item);
        });
        return newGroups;
    }, [groupedData, pagination, currentPage, currentPageSize, groupBy]);

    const totalPages = Math.ceil(processedData.length / currentPageSize);

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

    // Undo functionality
    const addUndoAction = useCallback((action: UndoAction) => {
        setUndoStack(prev => [...prev.slice(-9), action]); // Keep last 10 actions
    }, []);

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;

        const lastAction = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));

        switch (lastAction.type) {
            case 'delete':
                setGridData(prev => [...prev, lastAction.data]);
                break;
            case 'bulk_delete':
                setGridData(prev => [...prev, ...lastAction.data]);
                break;
            case 'edit':
                setGridData(prev => prev.map(row => 
                    getRowId(row) === lastAction.data.id ? lastAction.data.original : row
                ));
                break;
        }
    }, [undoStack, getRowId]);

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
                const allItems = Object.values(paginatedGroups).flat();
                const selectedRowData = allItems.filter(row => newSet.has(getRowId(row)));
                onSelectionChange(selectedRowData);
            }

            return newSet;
        });
    }, [paginatedGroups, getRowId, onSelectionChange]);

    const handleSelectAll = useCallback(() => {
        const allIds = Object.values(paginatedGroups).flat().map(row => getRowId(row));
        const allSelected = allIds.every(id => selectedRows.has(id));

        if (allSelected) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(allIds));
        }
    }, [paginatedGroups, selectedRows, getRowId]);

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

    const handleFavoriteItem = useCallback((rowId: string | number) => {
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
            type: 'delete',
            data: item,
            timestamp: Date.now(),
            description: `Deleted ${item.name || `item ${rowId}`}`
        });
        setGridData(prev => prev.filter(row => getRowId(row) !== rowId));
        setContextMenu(null);
    }, [getRowId, addUndoAction]);

    // Grid API
    const gridApi: GridApi<T> = useMemo(() => ({
        refreshData: () => setGridData([...data]),
        exportData: (format: 'csv' | 'excel' | 'json') => console.log(`Exporting as ${format}`),
        selectAll: handleSelectAll,
        clearSelection: () => setSelectedRows(new Set()),
        getSelectedRows: () => Object.values(paginatedGroups).flat().filter(row => selectedRows.has(getRowId(row))),
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
    }), [data, handleSelectAll, paginatedGroups, selectedRows, getRowId]);

    // Get grid columns based on size
    const getGridColumns = () => {
        switch (gridSize) {
            case 'small': return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5';
            case 'medium': return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
            case 'large': return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
            default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
        }
    };

    // Highlight text in content
    const highlightText = (text: string, highlight: string) => {
        if (!highlight || !text) return text;
        
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
                    {part}
                </mark>
            ) : part
        );
    };

    // Render item card based on view mode
    const renderItemCard = (item: T, index: number, groupIndex: number = 0) => {
        const rowId = getRowId(item);
        const isSelected = selectedRows.has(rowId);
        const isPinned = pinnedItems.has(rowId);
        const isFavorite = favorites.has(rowId);
        const isHovered = hoveredCard === rowId;

        const cardVariants: Variants = {
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.3,
                    delay: (index + groupIndex * 3) * 0.05,
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
                        isPinned && "ring-1 ring-white/20"
                    )}
                    onMouseEnter={() => setHoveredCard(rowId)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={(e) => onRowClick?.(item, e)}
                    onDoubleClick={(e) => {
                        e.preventDefault();
                        setPreviewItem(item);
                        setShowPreview(true);
                    }}
                    onContextMenu={(e) => {
                        if (enableContextMenu) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.min(e.clientX - rect.left, rect.width - 200);
                            const y = Math.min(e.clientY - rect.top, rect.height - 150);
                            
                            setContextMenu({ 
                                x: rect.left + x, 
                                y: rect.top + y, 
                                row: item 
                            });
                        }
                    }}
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
                                {highlightText(item.name || `Item ${rowId}`, highlightedText)}
                            </h3>
                            <div className="flex items-center gap-1">
                                <Badge
                                    variant="secondary"
                                    className="ml-2 bg-white/10 text-white border-white/20"
                                >
                                    {item.status || 'Active'}
                                </Badge>
                                {isFavorite && (
                                    <Heart className="h-3 w-3 text-red-400 fill-red-400" />
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-white/60 truncate mt-1">
                            {highlightText(item.email || item.department || 'No description', highlightedText)}
                        </p>
                        
                        {/* Tags */}
                        {item.tags && Array.isArray(item.tags) && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                                {item.tags.slice(0, 3).map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                                        {tag}
                                    </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                                        +{item.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}
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
                                handleFavoriteItem(rowId);
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
                    gridSize === 'large' && "p-8"
                )}
                onMouseEnter={() => setHoveredCard(rowId)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={(e) => onRowClick?.(item, e)}
                onDoubleClick={(e) => {
                    e.preventDefault();
                    setPreviewItem(item);
                    setShowPreview(true);
                }}
                onContextMenu={(e) => {
                    if (enableContextMenu) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.min(e.clientX - rect.left, rect.width - 200);
                        const y = Math.min(e.clientY - rect.top, rect.height - 150);
                        
                        setContextMenu({ 
                            x: rect.left + x, 
                            y: rect.top + y, 
                            row: item 
                        });
                    }
                }}
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
                        className="absolute top-3 right-8 w-3 h-3"
                    >
                        <Heart className="h-3 w-3 text-red-400 fill-red-400" />
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
                                {highlightText(item.name || `Item ${rowId}`, highlightedText)}
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
                                handleFavoriteItem(rowId);
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
                    </motion.div>
                </div>

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

                    {/* Tags */}
                    {item.tags && Array.isArray(item.tags) && (
                        <div className="flex flex-wrap gap-2">
                            {item.tags.slice(0, 4).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                </Badge>
                            ))}
                            {item.tags.length > 4 && (
                                <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                                    +{item.tags.length - 4} more
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Key details */}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        {item.department && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Building className="h-4 w-4" />
                                <span>{highlightText(item.department, highlightedText)}</span>
                            </div>
                        )}
                        {item.role && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Briefcase className="h-4 w-4" />
                                <span>{highlightText(item.role, highlightedText)}</span>
                            </div>
                        )}
                        {item.email && (
                            <div className="flex items-center gap-2 text-white/70">
                                <Mail className="h-4 w-4" />
                                <span className="truncate">{highlightText(item.email, highlightedText)}</span>
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
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-white/40">
                                <Keyboard className="h-3 w-3" />
                                Ctrl+F
                            </div>
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
                                            onClick={() => {
                                                const selectedItems = Object.values(paginatedGroups).flat().filter(row => selectedRows.has(getRowId(row)));
                                                addUndoAction({
                                                    type: 'bulk_delete',
                                                    data: selectedItems,
                                                    timestamp: Date.now(),
                                                    description: `Deleted ${selectedRows.size} items`
                                                });
                                                selectedRows.forEach(id => gridApi.removeRow(id));
                                                setSelectedRows(new Set());
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Undo button */}
                        <AnimatePresence>
                            {undoStack.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                        onClick={handleUndo}
                                    >
                                        <Undo className="h-4 w-4 mr-1" />
                                        Undo ({undoStack.length})
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-2">
                        {customToolbar}

                        {/* Quick filters */}
                        <Select value={quickFilter} onValueChange={setQuickFilter}>
                            <SelectTrigger className="w-40 bg-[#171717] border-white/20 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-white/20">
                                <SelectItem value="all" className="text-white">All Items</SelectItem>
                                <SelectItem value="recent" className="text-white">
                                    <Clock className="h-4 w-4 mr-2 inline" />
                                    Recently Added
                                </SelectItem>
                                <SelectItem value="pinned" className="text-white">
                                    <Pin className="h-4 w-4 mr-2 inline" />
                                    Pinned
                                </SelectItem>
                                <SelectItem value="favorites" className="text-white">
                                    <Heart className="h-4 w-4 mr-2 inline" />
                                    Favorites
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Group by */}
                        <Select value={groupBy} onValueChange={(value: GroupBy) => setGroupBy(value)}>
                            <SelectTrigger className="w-36 bg-[#171717] border-white/20 text-white">
                                <Group className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-white/20">
                                <SelectItem value="none" className="text-white">No Grouping</SelectItem>
                                <SelectItem value="status" className="text-white">By Status</SelectItem>
                                <SelectItem value="category" className="text-white">By Category</SelectItem>
                                <SelectItem value="tags" className="text-white">By Tags</SelectItem>
                                <SelectItem value="date" className="text-white">By Date</SelectItem>
                            </SelectContent>
                        </Select>

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
                    </div>
                </div>

                {/* Enhanced filter row */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Tag filters */}
                    {availableTags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">Tags:</span>
                            {availableTags.slice(0, 5).map(tag => (
                                <Button
                                    key={tag}
                                    size="sm"
                                    variant={tagFilters.has(tag) ? "default" : "outline"}
                                    className={cn(
                                        "h-7 px-2 text-xs",
                                        tagFilters.has(tag) 
                                            ? "bg-white text-black" 
                                            : "border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                                    )}
                                    onClick={() => {
                                        const newFilters = new Set(tagFilters);
                                        if (newFilters.has(tag)) {
                                            newFilters.delete(tag);
                                        } else {
                                            newFilters.add(tag);
                                        }
                                        setTagFilters(newFilters);
                                    }}
                                >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Status filters */}
                    {availableStatuses.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">Status:</span>
                            {availableStatuses.map(status => (
                                <Button
                                    key={status}
                                    size="sm"
                                    variant={statusFilters.has(status) ? "default" : "outline"}
                                    className={cn(
                                        "h-7 px-2 text-xs",
                                        statusFilters.has(status) 
                                            ? "bg-white text-black" 
                                            : "border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                                    )}
                                    onClick={() => {
                                        const newFilters = new Set(statusFilters);
                                        if (newFilters.has(status)) {
                                            newFilters.delete(status);
                                        } else {
                                            newFilters.add(status);
                                        }
                                        setStatusFilters(newFilters);
                                    }}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Clear all filters */}
                    {(tagFilters.size > 0 || statusFilters.size > 0 || Object.keys(filters).length > 0 || sorting.length > 0) && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/60 hover:text-white"
                            onClick={() => {
                                setTagFilters(new Set());
                                setStatusFilters(new Set());
                                setFilters({});
                                setSorting([]);
                            }}
                        >
                            <FilterX className="h-4 w-4 mr-1" />
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Filters and sorting display */}
                <AnimatePresence>
                    {(Object.keys(filters).length > 0 || sorting.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 pt-4 border-t border-white/10"
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
                            {processedData.length} items total
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
                        {groupBy !== 'none' && (
                            <span>• {Object.keys(groupedData).length} groups</span>
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
                                {Object.values(paginatedGroups).flat().length > 0 && Object.values(paginatedGroups).flat().every(row => selectedRows.has(getRowId(row))) ? 'Deselect All' : 'Select All'}
                            </Button>
                        )}
                        <div className="flex items-center gap-1 text-xs">
                            <Keyboard className="h-3 w-3" />
                            <span>Ctrl+A: Select All • Ctrl+Z: Undo • Double-click: Preview</span>
                        </div>
                    </div>
                </motion.div>

                {/* Grid/List View */}
                <AnimatePresence mode="wait">
                    {processedData.length === 0 ? (
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
                                {searchQuery || Object.keys(filters).length > 0 || tagFilters.size > 0 || statusFilters.size > 0
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'No data available to display'
                                }
                            </p>
                            {(searchQuery || Object.keys(filters).length > 0 || tagFilters.size > 0 || statusFilters.size > 0) && (
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilters({});
                                        setTagFilters(new Set());
                                        setStatusFilters(new Set());
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={viewMode + groupBy}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {Object.entries(paginatedGroups).map(([groupName, items], groupIndex) => (
                                <div key={groupName} className="space-y-4">
                                    {/* Group header */}
                                    {groupBy !== 'none' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: groupIndex * 0.1 }}
                                            className="flex items-center gap-3 pb-2 border-b border-white/10"
                                        >
                                            <h3 className="text-lg font-semibold text-white">{groupName}</h3>
                                            <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                                                {items.length} items
                                            </Badge>
                                        </motion.div>
                                    )}

                                    {/* Items grid */}
                                    <div className={cn(
                                        viewMode === 'compact' ? "space-y-3" : `grid gap-6 ${getGridColumns()}`
                                    )}>
                                        {items.map((item, index) => renderItemCard(item, index, groupIndex))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Enhanced Pagination */}
            {pagination && totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-6 border-t border-white/10 bg-[#171717]/20"
                >
                    <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>
                            Showing {((currentPage - 1) * currentPageSize) + 1} to{' '}
                            {Math.min(currentPage * currentPageSize, processedData.length)} of{' '}
                            {processedData.length} items
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
            )}

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
                            maxWidth: '200px'
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
                            Quick Preview
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    navigator.clipboard.writeText(JSON.stringify(contextMenu.row));
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Copy className="h-4 w-4" />
                            Copy Data
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
                            {contextMenu.row && pinnedItems.has(getRowId(contextMenu.row)) ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    const rowId = getRowId(contextMenu.row);
                                    handleFavoriteItem(rowId);
                                }
                                setContextMenu(null);
                            }}
                        >
                            <Heart className="h-4 w-4" />
                            {contextMenu.row && favorites.has(getRowId(contextMenu.row)) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <Separator className="my-1 bg-white/10" />
                        {enableInlineEditing && (
                            <button
                                className="w-full px-4 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-3"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit
                            </button>
                        )}
                        <Separator className="my-1 bg-white/10" />
                        <button
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3"
                            onClick={() => {
                                if (contextMenu.row) {
                                    handleDeleteItem(contextMenu.row);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Preview Drawer */}
            <AnimatePresence>
                {showPreview && previewItem && (
                    <Drawer open={showPreview} onOpenChange={setShowPreview}>
                        <DrawerContent className="bg-[#171717] border-white/20 max-h-[80vh]">
                            <DrawerHeader className="border-b border-white/10">
                                <DrawerTitle className="text-white flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Quick Preview - {previewItem.name || `Item ${getRowId(previewItem)}`}
                                </DrawerTitle>
                                <DrawerDescription className="text-white/60">
                                    Detailed view of the selected item
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left column - Basic info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            {previewItem.avatar ? (
                                                <img
                                                    src={previewItem.avatar}
                                                    alt={previewItem.name || 'Avatar'}
                                                    className="w-16 h-16 rounded-full border-2 border-white/20"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
                                                    <User className="h-8 w-8 text-white/70" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">{previewItem.name || `Item ${getRowId(previewItem)}`}</h3>
                                                <p className="text-white/60">ID: {getRowId(previewItem)}</p>
                                            </div>
                                        </div>

                                        {/* Status and actions */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="default" className="bg-white/10 text-white border-white/20">
                                                {previewItem.status || 'Active'}
                                            </Badge>
                                            {pinnedItems.has(getRowId(previewItem)) && (
                                                <Badge variant="outline" className="border-white/20 text-white/70">
                                                    <Pin className="h-3 w-3 mr-1" />
                                                    Pinned
                                                </Badge>
                                            )}
                                            {favorites.has(getRowId(previewItem)) && (
                                                <Badge variant="outline" className="border-white/20 text-white/70">
                                                    <Heart className="h-3 w-3 mr-1 fill-red-400 text-red-400" />
                                                    Favorite
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        {previewItem.tags && Array.isArray(previewItem.tags) && (
                                            <div>
                                                <h4 className="text-white font-medium mb-2">Tags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {previewItem.tags.map((tag: string) => (
                                                        <Badge key={tag} variant="outline" className="bg-white/5 border-white/20 text-white/70">
                                                            <Tag className="h-3 w-3 mr-1" />
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right column - Details */}
                                    <div className="space-y-4">
                                        <h4 className="text-white font-medium">Details</h4>
                                        <div className="grid gap-3 text-sm">
                                            {Object.entries(previewItem).map(([key, value]) => {
                                                if (key === 'avatar' || key === 'id' || key === 'name' || key === 'tags') return null;
                                                
                                                return (
                                                    <div key={key} className="flex justify-between items-center py-2 border-b border-white/10">
                                                        <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className="text-white font-medium">
                                                            {typeof value === 'object' && value !== null
                                                                ? JSON.stringify(value)
                                                                : String(value || 'N/A')
                                                            }
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                        onClick={() => {
                                            const rowId = getRowId(previewItem);
                                            handlePinItem(rowId);
                                        }}
                                    >
                                        <Pin className={cn("h-4 w-4 mr-2", pinnedItems.has(getRowId(previewItem)) && "fill-white")} />
                                        {pinnedItems.has(getRowId(previewItem)) ? 'Unpin' : 'Pin'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                        onClick={() => {
                                            const rowId = getRowId(previewItem);
                                            handleFavoriteItem(rowId);
                                        }}
                                    >
                                        <Heart className={cn("h-4 w-4 mr-2", favorites.has(getRowId(previewItem)) && "fill-red-400 text-red-400")} />
                                        {favorites.has(getRowId(previewItem)) ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </Button>
                                    {enableInlineEditing && (
                                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                        onClick={() => {
                                            handleDeleteItem(previewItem);
                                            setShowPreview(false);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DataGrid;
