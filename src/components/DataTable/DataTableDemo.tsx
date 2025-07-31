
import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { Column } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  progress: number;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export const DataTableDemo = () => {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const sampleData: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      progress: 85,
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-01-30')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'inactive',
      progress: 45,
      createdAt: new Date('2024-01-10'),
      lastLogin: new Date('2024-01-28')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Manager',
      status: 'pending',
      progress: 72,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'User',
      status: 'active',
      progress: 95,
      createdAt: new Date('2024-01-05'),
      lastLogin: new Date('2024-01-31')
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'User',
      status: 'active',
      progress: 60,
      createdAt: new Date('2024-01-12'),
      lastLogin: new Date('2024-01-29')
    }
  ];

  const columns: Column<User>[] = [
    {
      id: 'avatar',
      header: 'User',
      accessorKey: 'name',
      cell: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar} />
            <AvatarFallback>
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
      filterable: true
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: (value) => (
        <Badge variant={value === 'Admin' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Admin', value: 'Admin' },
        { label: 'Manager', value: 'Manager' },
        { label: 'User', value: 'User' }
      ]
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: (value) => (
        <Badge
          variant={
            value === 'active' ? 'default' :
              value === 'inactive' ? 'destructive' :
                'secondary'
          }
        >
          {value}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ]
    },
    {
      id: 'progress',
      header: 'Progress',
      accessorKey: 'progress',
      cell: (value) => (
        <div className="flex items-center gap-2">
          <Progress value={value} className="w-[60px]" />
          <span className="text-sm">{value}%</span>
        </div>
      ),
      sortable: true,
      align: 'center'
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      cell: (value) => value.toLocaleDateString(),
      sortable: true,
      filterable: true,
      filterType: 'date'
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      accessorKey: 'lastLogin',
      cell: (value) => value ? value.toLocaleDateString() : 'Never',
      sortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => console.log('View', row)}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => console.log('Edit', row)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => console.log('Delete', row)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
      sortable: false,
      filterable: false
    }
  ];

  const handleRowSelect = (rows: User[]) => {
    setSelectedRows(rows);
    console.log('Selected rows:', rows);
  };

  const handleRowEdit = (row: User, field: string, value: any) => {
    console.log('Edit row:', row, 'Field:', field, 'Value:', value);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log('Export format:', format);
  };

  return (
    <div className="space-y-6">
      <DataTable
        data={sampleData}
        columns={columns}
        searchable
        sortable
        filterable
        selectable
        multiSelect
        editable
        exportable
        pagination
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowSelect={handleRowSelect}
        onRowEdit={handleRowEdit}
        onExport={handleExport}
      />

      {selectedRows.length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Selected Rows Debug Info:</h3>
          <pre className="text-sm bg-background p-2 rounded border overflow-auto">
            {JSON.stringify(selectedRows, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
