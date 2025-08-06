import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useState } from "react";
import { DataGrid, generateSampleData, GridColumn } from ".";

// Demo Component
const DataGridDemo = () => {
    const [data, setData] = useState(() => generateSampleData(100));
    const [loading, setLoading] = useState(false);

    // Columns are still used for filtering and sorting, but not for display structure
    const columns: GridColumn[] = [
        {
            id: 'id',
            field: 'id',
            title: 'ID',
            type: 'number',
            sortable: true,
        },
        {
            id: 'name',
            field: 'name',
            title: 'Name',
            sortable: true,
            filterable: true,
        },
        {
            id: 'department',
            field: 'department',
            title: 'Department',
            sortable: true,
            filterable: true,
            type: 'select',
            options: [
                { label: 'Engineering', value: 'Engineering' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Sales', value: 'Sales' },
                { label: 'HR', value: 'HR' },
                { label: 'Finance', value: 'Finance' },
                { label: 'Operations', value: 'Operations' }
            ]
        },
        {
            id: 'role',
            field: 'role',
            title: 'Role',
            sortable: true,
            filterable: true,
        },
        {
            id: 'salary',
            field: 'salary',
            title: 'Salary',
            type: 'number',
            sortable: true,
            filterable: true,
        },
        {
            id: 'status',
            field: 'status',
            title: 'Status',
            sortable: true,
            filterable: true,
            type: 'select',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'On Leave', value: 'On Leave' },
                { label: 'Pending', value: 'Pending' }
            ]
        },
        {
            id: 'performance',
            field: 'performance',
            title: 'Performance',
            type: 'number',
            sortable: true,
        },
        {
            id: 'hireDate',
            field: 'hireDate',
            title: 'Hire Date',
            type: 'date',
            sortable: true,
        }
    ];

    const handleCellEdit = async (rowId, field, newValue, oldValue) => {
        console.log('Cell edited:', { rowId, field, newValue, oldValue });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    };


    const customFooter = (
        <div className="p-6 border-t border-white/10 bg-[#171717]/10">
            <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                    Modern bento grid layout with adaptive cards
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Interactive
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        Auto-adjusting
                    </Badge>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-black">

            <DataGrid
                data={data}
                columns={columns}
                loading={loading}
                enableRowSelection={true}
                enableMultiSelect={true}
                enableInlineEditing={true}
                enableBulkOperations={true}
                enableExport={true}
                enableContextMenu={true}
                pagination={true}
                pageSize={50}
                density="standard"
                onCellEdit={handleCellEdit}
                onSelectionChange={(rows) => console.log('Selection changed:', rows.length)}
                onRowClick={(row) => console.log('Row clicked:', row)}
                onRowDoubleClick={(row) => console.log('Row double clicked:', row)}
                customFooter={customFooter}
                className="shadow-2xl"
            />
        </div>
    );
};

export default DataGridDemo;