import React from 'react';

// Base interfaces
export interface ListItem {
    id: string | number;
    name?: string;
    email?: string;
    department?: string;
    position?: string;
    salary?: number;
    status?: string;
    priority?: string;
    avatar?: string;
    phone?: string;
    city?: string;
    joinDate?: Date;
    projects?: number;
    skills?: string[];
    bio?: string;
    rating?: number;
    lastActivity?: Date;
    isActive?: boolean;
    tags?: string[];
    [key: string]: any;
}

export interface ListViewColumn<T = any> {
    id: string;
    field: keyof T;
    title: string;
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    resizable?: boolean;
    pinned?: 'left' | 'right' | false;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'badge' | 'custom' | 'avatar' | 'rating' | 'tags';
    format?: (value: any, item: T) => string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    headerClassName?: string;
    cellClassName?: string;
    sticky?: boolean;
    hidden?: boolean;
}

export interface FilterConfig {
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in' | 'notIn';
    value: any;
    value2?: any; // For between operator
    label?: string;
}

export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

export interface ViewConfig {
    id: string;
    name: string;
    description?: string;
    columns: string[];
    filters: FilterConfig[];
    sorting: SortConfig[];
    groupBy?: string;
    density: 'compact' | 'normal' | 'comfortable';
    template: string;
    isDefault?: boolean;
    isPublic?: boolean;
}

export interface ListTemplate<T = any> {
    id: string;
    name: string;
    description?: string;
    component: React.ComponentType<ListItemProps<T>>;
    gridCols?: number;
    itemHeight?: number;
    spacing?: 'tight' | 'normal' | 'loose';
    supportsGrouping?: boolean;
    responsive?: {
        mobile?: React.ComponentType<ListItemProps<T>>;
        tablet?: React.ComponentType<ListItemProps<T>>;
    };
}

export interface ListItemProps<T = any> {
    item: T;
    index: number;
    isSelected: boolean;
    isHighlighted: boolean;
    isDragging?: boolean;
    isDropTarget?: boolean;
    onSelect: (selected: boolean) => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onBookmark?: () => void;
    onShare?: () => void;
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    onContextMenu?: (event: React.MouseEvent) => void;
    onDragStart?: (event: React.DragEvent) => void;
    onDrop?: (event: React.DragEvent) => void;
    template: ListTemplate<T>;
    columns: ListViewColumn<T>[];
    customActions?: React.ReactNode;
    density?: 'compact' | 'normal' | 'comfortable';
    showAvatar?: boolean;
    showActions?: boolean;
}

export interface BulkAction<T = any> {
    id: string;
    label: string;
    icon?: React.ReactNode;
    action: (items: T[]) => void | Promise<void>;
    variant?: 'default' | 'destructive' | 'outline';
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
    disabled?: (items: T[]) => boolean;
}

export interface ListViewProps<T extends ListItem = ListItem> {
    // Data
    data: T[];
    columns: ListViewColumn<T>[];
    templates?: ListTemplate<T>[];
    views?: ViewConfig[];
    bulkActions?: BulkAction<T>[];

    // State
    loading?: boolean;
    error?: string | null;

    // Features
    selectable?: boolean;
    multiSelect?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
    exportable?: boolean;
    draggable?: boolean;
    resizableColumns?: boolean;
    virtualScrolling?: boolean;
    infiniteScroll?: boolean;

    // Pagination
    pageSize?: number;
    pageSizeOptions?: number[];
    currentPage?: number;
    totalItems?: number;

    // Appearance
    density?: 'compact' | 'normal' | 'comfortable';
    layout?: 'list' | 'grid' | 'table' | 'card';
    defaultTemplate?: string;
    theme?: 'light' | 'dark' | 'auto';
    className?: string;
    itemClassName?: string;

    // Grouping
    groupBy?: string;
    showGroupHeaders?: boolean;
    collapsibleGroups?: boolean;
    stickyHeaders?: boolean;

    // Messages
    emptyMessage?: string;
    emptyDescription?: string;
    errorMessage?: string;
    loadingMessage?: string;

    // Callbacks - Data Events
    onItemClick?: (item: T, event: React.MouseEvent) => void;
    onItemDoubleClick?: (item: T, event: React.MouseEvent) => void;
    onItemContextMenu?: (item: T, event: React.MouseEvent) => void;
    onSelectionChange?: (selectedItems: T[]) => void;

    // Callbacks - State Events
    onSortChange?: (sort: SortConfig[]) => void;
    onFilterChange?: (filters: FilterConfig[]) => void;
    onPageChange?: (page: number, pageSize: number) => void;
    onSearchChange?: (query: string) => void;
    onViewChange?: (viewId: string) => void;
    onColumnResize?: (columnId: string, width: number) => void;
    onColumnReorder?: (fromIndex: number, toIndex: number) => void;

    // Callbacks - Action Events
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onDuplicate?: (item: T) => void;
    onBookmark?: (item: T) => void;
    onShare?: (item: T) => void;
    onExport?: (format: 'csv' | 'excel' | 'json' | 'pdf', data: T[]) => void;
    onRefresh?: () => void;

    // Callbacks - Drag & Drop
    onItemDragStart?: (item: T, event: React.DragEvent) => void;
    onItemDrop?: (draggedItem: T, targetItem: T, position: 'before' | 'after' | 'inside') => void;
    onBulkDrop?: (items: T[], targetItem: T, position: 'before' | 'after' | 'inside') => void;

    // Custom Content
    customToolbar?: React.ReactNode;
    customActions?: (item: T) => React.ReactNode;
    customFilters?: React.ReactNode;
    customEmptyState?: React.ReactNode;
    customHeader?: React.ReactNode;
    customFooter?: React.ReactNode;

    // Utility
    getItemId?: (item: T) => string | number;
    getItemUrl?: (item: T) => string;
    isItemDisabled?: (item: T) => boolean;
    isItemVisible?: (item: T) => boolean;

    // Advanced Features
    quickFilters?: QuickFilter[];
    savedViews?: boolean;
    columnVisibility?: boolean;
    advancedSearch?: boolean;
    realTimeUpdates?: boolean;
    keyboardShortcuts?: boolean;
}

export interface QuickFilter {
    id: string;
    label: string;
    field: string;
    value: any;
    operator?: string;
    icon?: React.ReactNode;
    color?: string;
}

export interface SearchConfig {
    placeholder?: string;
    debounceMs?: number;
    minLength?: number;
    searchFields?: string[];
    highlightResults?: boolean;
}

export interface ExportConfig {
    formats: ('csv' | 'excel' | 'json' | 'pdf')[];
    filename?: string;
    includeFilters?: boolean;
    customExporter?: (format: string, data: any[]) => void;
}

export interface PaginationConfig {
    showPageSize?: boolean;
    showPageNumbers?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
    pageSizeOptions?: number[];
    maxPageNumbers?: number;
}

// Utility types
export type ListViewRef<T = any> = {
    selectAll: () => void;
    deselectAll: () => void;
    selectItems: (ids: (string | number)[]) => void;
    getSelectedItems: () => T[];
    refresh: () => void;
    exportData: (format: string) => void;
    applyFilter: (filter: FilterConfig) => void;
    clearFilters: () => void;
    scrollToItem: (id: string | number) => void;
    focusSearch: () => void;
};

// Sample data generator with enhanced data
export const generateSampleData = (count: number = 100): ListItem[] => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'Austin', 'Seattle', 'Boston', 'Denver'];
    const statuses = ['Active', 'Inactive', 'Pending', 'On Leave', 'Remote'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const positions = ['Senior Manager', 'Developer', 'Senior Developer', 'Lead Designer', 'Data Analyst', 'Product Manager', 'Director', 'VP'];
    const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL'];
    const tags = ['New Hire', 'Top Performer', 'Team Lead', 'Mentor', 'Remote', 'Part-time', 'Contractor'];

    const names = [
        'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt',
        'Fiona Green', 'George Wilson', 'Hannah Davis', 'Ian McKenzie', 'Julia Roberts',
        'Kevin Hart', 'Luna Lovegood', 'Mike Johnson', 'Nina Patel', 'Oliver Stone',
        'Paula Adams', 'Quinn Taylor', 'Rachel Green', 'Sam Wilson', 'Tina Turner'
    ];

    return Array.from({ length: count }, (_, i) => {
        const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 2);
        const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
        const joinDate = new Date(2018 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));

        return {
            id: i + 1,
            name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
            email: `user${i + 1}@company.com`,
            phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            position: positions[Math.floor(Math.random() * positions.length)],
            salary: Math.floor(Math.random() * 100000) + 45000,
            city: cities[Math.floor(Math.random() * cities.length)],
            joinDate,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
            rating: Math.floor(Math.random() * 5) + 1,
            projects: Math.floor(Math.random() * 25) + 1,
            lastActivity: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            isActive: Math.random() > 0.2,
            skills: randomSkills,
            tags: randomTags,
            bio: `Experienced ${positions[Math.floor(Math.random() * positions.length)].toLowerCase()} with ${Math.floor(Math.random() * 10) + 1} years in the industry.`
        };
    });
};