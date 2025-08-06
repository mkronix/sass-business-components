// components/data-display/dataGrid/components/Toolbar.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    Clock,
    Download,
    Filter,
    Grid3X3,
    Group,
    Heart,
    Keyboard,
    List,
    Pin,
    RefreshCw,
    Search,
    Settings,
    Trash2,
    Zap,
    CheckCircle,
    XCircle
} from 'lucide-react';
import React from 'react';

type ViewMode = 'grid' | 'compact' | 'cards';
type GroupBy = 'none' | 'department' | 'status' | 'tags' | 'hireDate';
type QuickFilter = 'all' | 'recent' | 'pinned' | 'favorites' | 'active' | 'inactive';

interface ToolbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    quickFilter: QuickFilter;
    onQuickFilterChange: (filter: QuickFilter) => void;
    selectedRows: Set<string | number>;
    onBulkDelete: () => void;
    enableBulkOperations: boolean;
    groupBy: GroupBy;
    onGroupByChange: (groupBy: GroupBy) => void;
    showFilters: boolean;
    onShowFiltersChange: (show: boolean) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    onSettingsClick: () => void;
    enableExport: boolean;
    gridApi: any;
    onRefresh: () => void;
    onKeyboardHelpClick: () => void;
    onAdvancedFiltersClick: () => void;
    customToolbar?: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({
    searchQuery,
    onSearchChange,
    quickFilter,
    onQuickFilterChange,
    selectedRows,
    onBulkDelete,
    enableBulkOperations,
    groupBy,
    onGroupByChange,
    showFilters,
    onShowFiltersChange,
    viewMode,
    onViewModeChange,
    onSettingsClick,
    enableExport,
    gridApi,
    onRefresh,
    onKeyboardHelpClick,
    onAdvancedFiltersClick,
    customToolbar
}) => {
    return (
        <div className="p-2 bg-[#171717]/30">
            <style>
                {`
                    .scrollbar-ui::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
            <div className="scrollbar-ui flex items-center justify-between mb-2 overflow-x-auto whitespace-nowrap">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Search */}
                    <div className="relative flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 w-72 bg-[#171717] border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {(['all', 'recent', 'pinned', 'favorites'] as QuickFilter[]).map(filter => (
                            <Button
                                key={filter}
                                size="sm"
                                variant={quickFilter === filter ? 'default' : 'ghost'}
                                className={cn(
                                    "h-8 px-3 text-xs flex-shrink-0",
                                    quickFilter === filter
                                        ? 'bg-white text-black'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                                onClick={() => onQuickFilterChange(filter)}
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

                    {/* Bulk Operations */}
                    {selectedRows.size > 0 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 rounded-md py-1 px-2">
                                <Zap className="h-3 w-3 mr-1" />
                                {selectedRows.size} selected
                            </Badge>
                            {enableBulkOperations && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10 h-8"
                                    onClick={onBulkDelete}
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {customToolbar}

                    {/* Grouping controls */}
                    <Select value={groupBy} onValueChange={(value: GroupBy) => onGroupByChange(value)}>
                        <SelectTrigger className="w-36 bg-[#171717] border-white/20 text-white h-8">
                            <Group className="h-3 w-3 mr-2" />
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

                    {/* Filters Toggle */}
                    <Button
                        size="sm"
                        variant={showFilters ? 'default' : 'outline'}
                        className={cn(
                            "h-8",
                            showFilters
                                ? 'bg-white text-black'
                                : 'border-white/20 text-white hover:bg-white/10'
                        )}
                        onClick={() => onShowFiltersChange(!showFilters)}
                    >
                        <Filter className="h-3 w-3 mr-1" />
                        Filters
                    </Button>

                    {/* Advanced Filters Button */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 h-8"
                        onClick={onAdvancedFiltersClick}
                    >
                        <Filter className="h-3 w-3 mr-1" />
                        Advanced
                    </Button>

                    {/* View mode switcher */}
                    <div className="flex items-center bg-[#171717] border border-white/20 rounded-lg p-1">
                        <Button
                            size="sm"
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            className={cn(
                                "h-6 px-2",
                                viewMode === 'grid' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
                            )}
                            onClick={() => onViewModeChange('grid')}
                        >
                            <Grid3X3 className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'compact' ? 'default' : 'ghost'}
                            className={cn(
                                "h-6 px-2",
                                viewMode === 'compact' ? 'bg-white text-black' : 'text-white/70 hover:text-white hover:bg-white/10'
                            )}
                            onClick={() => onViewModeChange('compact')}
                        >
                            <List className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Settings */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 h-8"
                        onClick={onSettingsClick}
                    >
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                    </Button>

                    {/* Export */}
                    {enableExport && (
                        <Select onValueChange={(format) => gridApi.exportData(format as any)}>
                            <SelectTrigger className="w-32 bg-[#171717] border-white/20 text-white h-8">
                                <Download className="h-3 w-3 mr-2" />
                                Export
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-white/20">
                                <SelectItem value="csv" className="text-white">CSV</SelectItem>
                                <SelectItem value="excel" className="text-white">Excel</SelectItem>
                                <SelectItem value="json" className="text-white">JSON</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    {/* Refresh */}
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 h-8 w-8 p-0"
                        onClick={onRefresh}
                    >
                        <RefreshCw className="h-3 w-3" />
                    </Button>

                    {/* Keyboard Help */}
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                        onClick={onKeyboardHelpClick}
                    >
                        <Keyboard className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;