
// Types
interface ListItem {
    id: string | number;
    [key: string]: any;
}

interface ListViewColumn<T = any> {
    id: string;
    field: string;
    title: string;
    width?: string | number;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'badge' | 'custom';
    format?: (value: any, item: T) => string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

interface ListTemplate<T = any> {
    id: string;
    name: string;
    description?: string;
    component: (props: ListItemProps<T>) => React.ReactNode;
    gridCols?: number;
    itemHeight?: number;
    spacing?: 'tight' | 'normal' | 'loose';
}

interface ListItemProps<T = any> {
    item: T;
    index: number;
    isSelected: boolean;
    isHighlighted: boolean;
    onSelect: (selected: boolean) => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    template: ListTemplate<T>;
    columns: ListViewColumn<T>[];
    customActions?: React.ReactNode;
}

interface FilterConfig {
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between';
    value: any;
    value2?: any;
}

interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

interface ListViewProps<T extends ListItem = ListItem> {
    data: T[];
    columns: ListViewColumn<T>[];
    templates?: ListTemplate<T>[];
    loading?: boolean;
    selectable?: boolean;
    multiSelect?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    exportable?: boolean;
    emptyMessage?: string;
    emptyDescription?: string;
    className?: string;
    itemClassName?: string;
    density?: 'compact' | 'normal' | 'comfortable';
    layout?: 'list' | 'grid' | 'table' | 'card';
    defaultTemplate?: string;
    virtualScrolling?: boolean;
    groupBy?: string;
    showGroupHeaders?: boolean;
    stickyHeaders?: boolean;
    onItemClick?: (item: T, event: React.MouseEvent) => void;
    onItemDoubleClick?: (item: T, event: React.MouseEvent) => void;
    onSelectionChange?: (selectedItems: T[]) => void;
    onSortChange?: (sort: SortConfig[]) => void;
    onFilterChange?: (filters: FilterConfig[]) => void;
    onPageChange?: (page: number, pageSize: number) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onExport?: (format: 'csv' | 'excel' | 'json', data: T[]) => void;
    customToolbar?: React.ReactNode;
    customActions?: (item: T) => React.ReactNode;
    getItemId?: (item: T) => string | number;
}

export type { ListItem, ListViewProps, ListViewColumn, ListTemplate, ListItemProps, FilterConfig, SortConfig };
// Sample data generator
const generateSampleData = (count: number = 100) => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `John Doe ${i + 1}`,
        email: `john.doe${i + 1}@company.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        department: departments[Math.floor(Math.random() * departments.length)],
        position: ['Manager', 'Developer', 'Designer', 'Analyst', 'Director'][Math.floor(Math.random() * 5)],
        salary: Math.floor(Math.random() * 100000) + 40000,
        city: cities[Math.floor(Math.random() * cities.length)],
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        rating: Math.floor(Math.random() * 5) + 1,
        projects: Math.floor(Math.random() * 20),
        lastActivity: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        isActive: Math.random() > 0.3,
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].slice(0, Math.floor(Math.random() * 5) + 1),
        bio: `Experienced professional with ${Math.floor(Math.random() * 10) + 1} years in the industry.`
    }));
};

export { generateSampleData };