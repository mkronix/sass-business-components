import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Edit2, Eye, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DataTable from './DataTable';

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample data
  const sampleData = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      progress: 85,
      salary: 75000,
      department: 'Engineering',
      avatar: '/api/placeholder/32/32',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-01-30'),
      tasks: 23,
      completed: 19
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'active',
      progress: 92,
      salary: 85000,
      department: 'Marketing',
      avatar: '/api/placeholder/32/32',
      createdAt: new Date('2024-01-10'),
      lastLogin: new Date('2024-01-31'),
      tasks: 18,
      completed: 16
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'Developer',
      status: 'inactive',
      progress: 67,
      salary: 65000,
      department: 'Engineering',
      avatar: '/api/placeholder/32/32',
      createdAt: new Date('2024-01-20'),
      lastLogin: new Date('2024-01-25'),
      tasks: 31,
      completed: 21
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'Designer',
      status: 'active',
      progress: 78,
      salary: 70000,
      department: 'Design',
      avatar: '/api/placeholder/32/32',
      createdAt: new Date('2024-01-05'),
      lastLogin: new Date('2024-01-31'),
      tasks: 12,
      completed: 9
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'Developer',
      status: 'pending',
      progress: 45,
      salary: 62000,
      department: 'Engineering',
      avatar: '/api/placeholder/32/32',
      createdAt: new Date('2024-01-12'),
      lastLogin: new Date('2024-01-28'),
      tasks: 27,
      completed: 12
    },
    {
      id: '6',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'Manager',
      status: 'active',
      progress: 95,
      salary: 90000,
      department: 'Sales',
      avatar: '/api/placeholder/32/32',
      createdAt: new Date('2024-01-08'),
      lastLogin: new Date('2024-01-31'),
      tasks: 15,
      completed: 14
    }
  ];

  // Column definitions
  const columns = [
    {
      id: 'user',
      header: 'User',
      accessorKey: 'name',
      sticky: true,
      cell: (value, row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={row.avatar} alt={row.name} />
            <AvatarFallback className="text-xs">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{row.name}</div>
            <div className="text-sm text-muted-foreground truncate">{row.email}</div>
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
        <Badge
          variant={
            value === 'Admin' ? 'default' :
              value === 'Manager' ? 'secondary' :
                'outline'
          }
          className="font-medium"
        >
          {value}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Admin', value: 'Admin' },
        { label: 'Manager', value: 'Manager' },
        { label: 'Developer', value: 'Developer' },
        { label: 'Designer', value: 'Designer' }
      ]
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      cell: (value) => (
        <span className="font-medium text-sm">{value}</span>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
      filterOptions: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Design', value: 'Design' },
        { label: 'Sales', value: 'Sales' }
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
          className="font-medium"
        >
          <div className={cn(
            "w-2 h-2 rounded-full mr-2",
            value === 'active' && "bg-green-500",
            value === 'inactive' && "bg-red-500",
            value === 'pending' && "bg-yellow-500"
          )} />
          {value}
        </Badge>
      ),
      sortable: true,
      filterable: true,
      filterType: 'select' as const,
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
        <div className="flex items-center gap-3 min-w-[120px]">
          <Progress value={value} className="flex-1" />
          <span className="text-sm font-medium w-10 text-right">{value}%</span>
        </div>
      ),
      sortable: true,
      align: 'center' as const
    },
    {
      id: 'tasks',
      header: 'Tasks',
      accessorKey: 'tasks',
      cell: (value, row) => (
        <div className="text-center">
          <div className="font-medium">{row.completed}/{value}</div>
          <div className="text-xs text-muted-foreground">completed</div>
        </div>
      ),
      sortable: true,
      align: 'center' as const
    },
    {
      id: 'salary',
      header: 'Salary',
      accessorKey: 'salary',
      cell: (value) => (
        <span className="font-mono font-medium">
          ${value.toLocaleString()}
        </span>
      ),
      sortable: true,
      filterable: true,
      filterType: 'number' as const,
      align: 'right' as const
    },
    {
      id: 'createdAt',
      header: 'Joined',
      accessorKey: 'createdAt',
      cell: (value) => (
        <div className="text-sm">
          <div className="font-medium">{value.toLocaleDateString()}</div>
          <div className="text-muted-foreground">{value.toLocaleDateString('en-US', { weekday: 'short' })}</div>
        </div>
      ),
      sortable: true,
      filterable: true,
      filterType: 'date' as const
    },
    {
      id: 'lastLogin',
      header: 'Last Active',
      accessorKey: 'lastLogin',
      cell: (value) => {
        if (!value) return <span className="text-muted-foreground">Never</span>;
        const days = Math.floor((new Date().getTime() - value.getTime()) / (1000 * 60 * 60 * 24));
        return (
          <div className="text-sm">
            <div className="font-medium">{value.toLocaleDateString()}</div>
            <div className="text-muted-foreground">
              {days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`}
            </div>
          </div>
        );
      },
      sortable: true
    }
  ];

  const handleRowSelect = (rows) => {
    setSelectedRows(rows);
    console.log('Selected rows:', rows);
  };

  const handleRowEdit = (row, field, value) => {
    console.log('Edit row:', row.id, 'Field:', field, 'Value:', value);
    // Here you would typically update your data source
  };

  const handleExport = (format, data) => {
    console.log('Export format:', format, 'Data count:', data.length);
    // Here you would implement actual export logic
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const rowActions = (row, index) => (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => console.log('View', row)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => console.log('Edit', row)}
        className="h-8 w-8 p-0"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => console.log('Delete', row)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const globalActions = (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline">
        <Settings className="h-4 w-4 mr-2" />
        Bulk Actions
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">

      <DataTable
        data={sampleData}
        columns={columns}
        loading={loading}
        searchable
        sortable
        filterable
        selectable
        multiSelect
        editable
        exportable
        pagination
        pageSize={5}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowSelect={handleRowSelect}
        onRowEdit={handleRowEdit}
        onExport={handleExport}
        onRefresh={handleRefresh}
        rowActions={rowActions}
        globalActions={globalActions}
        enableColumnVisibility
        enableDensity
        stickyHeader
        zebra
        bordered
        className="w-full"
      />

      {selectedRows.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Selection Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-40">
              {JSON.stringify(selectedRows, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
