import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { generateSampleData, ListViewColumn } from "./types";
import ListView from "./ListView";
const ListViewDemo = () => {
    const [data, setData] = useState(() => generateSampleData(100));
    const [loading, setLoading] = useState(false);

    const columns: ListViewColumn[] = [
        {
            id: 'name',
            field: 'name',
            title: 'Name',
            width: '200px',
            sortable: true,
            searchable: true
        },
        {
            id: 'email',
            field: 'email',
            title: 'Email',
            width: '250px',
            sortable: true,
            searchable: true
        },
        {
            id: 'department',
            field: 'department',
            title: 'Department',
            width: '150px',
            sortable: true,
            filterable: true
        },
        {
            id: 'position',
            field: 'position',
            title: 'Position',
            width: '150px',
            sortable: true,
            filterable: true
        },
        {
            id: 'salary',
            field: 'salary',
            title: 'Salary',
            width: '120px',
            type: 'number',
            align: 'right',
            sortable: true,
            format: (value) => `${value.toLocaleString()}`
        },
        {
            id: 'status',
            field: 'status',
            title: 'Status',
            width: '100px',
            sortable: true,
            filterable: true,
            render: (value) => (
                <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
                    {value}
                </Badge>
            )
        },
        {
            id: 'joinDate',
            field: 'joinDate',
            title: 'Join Date',
            width: '120px',
            type: 'date',
            sortable: true,
            format: (value) => value.toLocaleDateString()
        }
    ];

    const customActions = (item: any) => (
        <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Edit2 className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive">
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
    );

    const customToolbar = (
        <div className="flex items-center gap-2">
            <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Employee
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
                setLoading(true);
                setTimeout(() => {
                    setData(generateSampleData(100));
                    setLoading(false);
                }, 1000);
            }}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Enhanced ListView Demo</h2>
                <p className="text-muted-foreground">
                    Flexible list component with multiple view templates, advanced filtering, and comprehensive features.
                </p>
            </div>

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
                groupBy="department"
                showGroupHeaders
                customToolbar={customToolbar}
                customActions={customActions}
                onSelectionChange={(items) => console.log('Selected:', items.length)}
                onItemClick={(item) => console.log('Clicked:', item.name)}
                onEdit={(item) => console.log('Edit:', item.name)}
                onDelete={(item) => console.log('Delete:', item.name)}
                onExport={(format, data) => console.log('Export:', format, data.length)}
                className="min-h-[600px]"
            />
        </div>
    );
};

export default ListViewDemo;