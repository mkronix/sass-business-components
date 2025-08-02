import { useState } from "react";
import { DataGrid, generateSampleData, GridColumn } from ".";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Edit2, Eye, Plus, RefreshCw, Trash2, X } from "lucide-react";

// Demo Component
const DataGridDemo = () => {
    const [data, setData] = useState(() => generateSampleData(1000));
    const [loading, setLoading] = useState(false);

    const columns: GridColumn[] = [
        {
            id: 'id',
            field: 'id',
            title: 'ID',
            width: 80,
            type: 'number',
            sortable: true,
            pinned: 'left'
        },
        {
            id: 'employee',
            field: 'name',
            title: 'Employee',
            width: 200,
            sortable: true,
            editable: true,
            pinned: 'left',
            cellRenderer: ({ value, row }) => (
                <div className="flex items-center gap-3 px-3 py-2">
                    <img
                        src={row.avatar}
                        alt={value}
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div className="font-medium text-sm">{value}</div>
                        <div className="text-xs text-muted-foreground">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            id: 'department',
            field: 'department',
            title: 'Department',
            width: 120,
            sortable: true,
            filterable: true,
            editable: true,
            type: 'select',
            options: [
                { label: 'Engineering', value: 'Engineering' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Sales', value: 'Sales' },
                { label: 'HR', value: 'HR' },
                { label: 'Finance', value: 'Finance' }
            ]
        },
        {
            id: 'role',
            field: 'role',
            title: 'Role',
            width: 120,
            sortable: true,
            editable: true
        },
        {
            id: 'salary',
            field: 'salary',
            title: 'Salary',
            width: 120,
            type: 'number',
            align: 'right',
            sortable: true,
            editable: true,
            format: (value) => `${value.toLocaleString()}`,
            aggregation: 'avg'
        },
        {
            id: 'hireDate',
            field: 'hireDate',
            title: 'Hire Date',
            width: 120,
            type: 'date',
            sortable: true,
            format: (value) => value.toLocaleDateString()
        },
        {
            id: 'status',
            field: 'status',
            title: 'Status',
            width: 100,
            sortable: true,
            filterable: true,
            cellRenderer: ({ value }) => (
                <div className="px-3 py-2">
                    <Badge
                        variant={
                            value === 'Active' ? 'default' :
                                value === 'Inactive' ? 'destructive' :
                                    'secondary'
                        }
                        className="text-xs"
                    >
                        {value}
                    </Badge>
                </div>
            )
        },
        {
            id: 'performance',
            field: 'performance',
            title: 'Performance',
            width: 150,
            type: 'number',
            sortable: true,
            cellRenderer: ({ value }) => (
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Progress value={value} className="flex-1 h-2" />
                        <span className="text-xs font-medium w-8">{value}%</span>
                    </div>
                </div>
            )
        },
        {
            id: 'projects',
            field: 'projects',
            title: 'Projects',
            width: 80,
            type: 'number',
            align: 'center',
            sortable: true,
            aggregation: 'sum'
        },
        {
            id: 'isManager',
            field: 'isManager',
            title: 'Manager',
            width: 80,
            type: 'boolean',
            align: 'center',
            sortable: true,
            cellRenderer: ({ value }) => (
                <div className="px-3 py-2 text-center">
                    {value ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-red-600 mx-auto" />}
                </div>
            )
        },
        {
            id: 'phoneNumber',
            field: 'phoneNumber',
            title: 'Phone',
            width: 120,
            sortable: true,
            editable: true
        },
        {
            id: 'contractType',
            field: 'contractType',
            title: 'Contract Type',
            width: 120,
            sortable: true,
            filterable: true
        },
        {
            id: 'lastLogin',
            field: 'lastLogin',
            title: 'Last Login',
            width: 140,
            type: 'date',
            sortable: true,
            format: (value) => {
                const days = Math.floor((Date.now() - value.getTime()) / (1000 * 60 * 60 * 24));
                return days === 0 ? 'Today' : `${days} days ago`;
            }
        },
        {
            id: 'actions',
            field: 'actions',
            title: 'Actions',
            width: 120,
            pinned: 'right',
            cellRenderer: ({ row, api }) => (
                <div className="flex items-center gap-1 px-2 py-2">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={() => api.removeRow(row.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            )
        }
    ];

    const handleCellEdit = async (rowId, field, newValue, oldValue) => {
        console.log('Cell edited:', { rowId, field, newValue, oldValue });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    };

    const customToolbar = (
        <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => console.log('Add new employee')}>
                <Plus className="h-4 w-4 mr-1" />
                Add Employee
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
                setLoading(true);
                setTimeout(() => {
                    setData(generateSampleData(1000));
                    setLoading(false);
                }, 1000);
            }}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Regenerate Data
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Enhanced DataGrid Demo</h2>
                <p className="text-muted-foreground">
                    Advanced data grid with column management, inline editing, filtering, sorting, and more.
                </p>
            </div>

            <DataGrid
                data={data}
                columns={columns}
                loading={loading}
                enableVirtualScrolling={true}
                enableColumnResize={true}
                enableColumnReorder={true}
                enableColumnPinning={true}
                enableRowSelection={true}
                enableMultiSelect={true}
                enableInlineEditing={true}
                enableBulkOperations={true}
                enableExport={true}
                enableAggregation={true}
                enableContextMenu={true}
                enableUndoRedo={true}
                pagination={true}
                pageSize={100}
                density="standard"
                onCellEdit={handleCellEdit}
                onSelectionChange={(rows) => console.log('Selection changed:', rows.length)}
                customToolbar={customToolbar}
                className="min-h-[600px]"
            />
        </div>
    );
};

export default DataGridDemo;