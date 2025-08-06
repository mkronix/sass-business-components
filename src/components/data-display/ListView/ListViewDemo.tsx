import {
    Download,
    Trash2,
    TrendingUp,
    Users, Zap
} from 'lucide-react';
import { useState } from 'react';
import ListView from './ListView';
import { BulkAction, generateSampleData, ListViewColumn, QuickFilter } from './types';

// Demo Component
const ListViewDemo = () => {
    const [data, setData] = useState(() => generateSampleData(75));
    const [loading, setLoading] = useState(false);

    const columns: ListViewColumn[] = [
        {
            id: 'name',
            field: 'name',
            title: 'Name',
            sortable: true,
            searchable: true
        },
        {
            id: 'email',
            field: 'email',
            title: 'Email',
            sortable: true,
            searchable: true
        },
        {
            id: 'department',
            field: 'department',
            title: 'Department',
            sortable: true,
            filterable: true
        },
        {
            id: 'position',
            field: 'position',
            title: 'Position',
            sortable: true,
            filterable: true
        },
        {
            id: 'salary',
            field: 'salary',
            title: 'Salary',
            type: 'number',
            align: 'right',
            sortable: true,
            format: (value) => `${value.toLocaleString()}`
        },
        {
            id: 'status',
            field: 'status',
            title: 'Status',
            sortable: true,
            filterable: true
        }
    ];

    const quickFilters: QuickFilter[] = [
        {
            id: 'active',
            label: 'Active',
            field: 'status',
            value: 'Active',
            icon: <Users className="h-4 w-4" />
        },
        {
            id: 'engineering',
            label: 'Engineering',
            field: 'department',
            value: 'Engineering',
            icon: <Zap className="h-4 w-4" />
        },
        {
            id: 'high-salary',
            label: 'High Salary',
            field: 'salary',
            value: 100000,
            operator: 'gte',
            icon: <TrendingUp className="h-4 w-4" />
        }
    ];

    const bulkActions: BulkAction[] = [
        {
            id: 'export',
            label: 'Export Selected',
            icon: <Download className="h-4 w-4" />,
            action: (items) => console.log('Exporting:', items.length, 'items'),
            variant: 'outline'
        },
        {
            id: 'delete',
            label: 'Delete Selected',
            icon: <Trash2 className="h-4 w-4" />,
            action: (items) => console.log('Deleting:', items.length, 'items'),
            variant: 'destructive'
        }
    ];


    return (

        <ListView
            data={data}
            columns={columns}
            loading={loading}
            selectable
            multiSelect
            searchable
            filterable
            sortable
            pagination
            exportable
            pageSize={20}
            pageSizeOptions={[10, 20, 50, 100]}
            density="normal"
            groupBy="department"
            showGroupHeaders
            collapsibleGroups
            quickFilters={quickFilters}
            bulkActions={bulkActions}
            onSelectionChange={(items) => console.log('Selected:', items.length, 'items')}
            onItemClick={(item) => console.log('Clicked:', item.name)}
            onEdit={(item) => console.log('Edit:', item.name)}
            onDelete={(item) => console.log('Delete:', item.name)}
            onDuplicate={(item) => console.log('Duplicate:', item.name)}
            onBookmark={(item) => console.log('Bookmark:', item.name)}
            onShare={(item) => console.log('Share:', item.name)}
            onExport={(format, data) => console.log('Export:', format, data.length, 'items')}
            onRefresh={() => {
                setLoading(true);
                setTimeout(() => {
                    setData(generateSampleData(75));
                    setLoading(false);
                }, 1000);
            }}
            className="min-h-[600px]"
        />

    );
};

export default ListViewDemo;