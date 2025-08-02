
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  Info,
  Keyboard,
  Lightbulb,
  Package,
  Palette,
  Settings,
  Shield,
  Star,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import COMPONENTS from '@/data/components';
import DataTable from '@/components/data-display/DataTable/DataTable';
import DataGrid from '@/components/data-display/DatGrid/DataGrid';
import TableDocs from '@/data/documentation/data-display/data-table.json';

// Sample data for demo purposes
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-14' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', lastLogin: '2024-01-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-16' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-13' },
];

const sampleColumns = [
  { id: 'name', field: 'name', title: 'Name', width: 150, sortable: true, filterable: true },
  { id: 'email', field: 'email', title: 'Email', width: 200, sortable: true, filterable: true },
  { id: 'role', field: 'role', title: 'Role', width: 100, sortable: true, filterable: true },
  { id: 'status', field: 'status', title: 'Status', width: 100, sortable: true, filterable: true },
  { id: 'lastLogin', field: 'lastLogin', title: 'Last Login', width: 150, sortable: true, filterable: true, type: 'date' as const },
];

const componentMap: Record<string, {
  component: React.ComponentType<any>;
  documentation: any;
}> = {
  'enhanced-data-table': {
    component: DataTable,
    documentation: TableDocs
  },
  'data-table': {
    component: DataTable,
    documentation: TableDocs
  },
  'datatable': {
    component: DataTable,
    documentation: TableDocs
  },
  'data-grid': {
    component: () => <DataGrid data={sampleData} columns={sampleColumns} />,
    documentation: TableDocs
  },
  'datagrid': {
    component: () => <DataGrid data={sampleData} columns={sampleColumns} />,
    documentation: TableDocs
  },
  'enhanced-data-grid': {
    component: () => <DataGrid data={sampleData} columns={sampleColumns} />,
    documentation: TableDocs
  }
};

export default function EnhancedSubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Find the category and component from COMPONENTS data
  const categoryData = COMPONENTS.find(cat => cat.id === categoryId);
  const componentItem = categoryData?.items.find(item => {
    const itemSlug = item.name?.toLowerCase().replace(/\s+/g, '-') ||
      item.title?.toLowerCase().replace(/\s+/g, '-');
    return itemSlug === subcategoryId || item.url?.includes(subcategoryId || '');
  });

  const componentKey = subcategoryId || '';
  const componentInfo = componentMap[componentKey] || componentMap['enhanced-data-table'];

  if (!categoryData || !componentItem) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Code2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Component Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The requested component does not exist or is not yet implemented.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Link to="/">
              <Button>
                Explore Components
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { component: Component, documentation: docs } = componentInfo;
  const isReady = componentItem.status === 'ready';

  const copyToClipboard = async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(label || 'code');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'default';
      case 'beta': return 'secondary';
      case 'alpha': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isStringArray = (value: unknown): value is string[] => {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  };

  const isObjectRecord = (value: unknown): value is Record<string, any> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  };

  // Sample usage code for components
  const getUsageCode = (componentName: string) => {
    switch (componentName) {
      case 'data-grid':
      case 'datagrid':
      case 'enhanced-data-grid':
        return `import DataGrid from '@/components/data-display/DatGrid/DataGrid';

const columns = [
  { id: 'name', field: 'name', title: 'Name', width: 150, sortable: true },
  { id: 'email', field: 'email', title: 'Email', width: 200, sortable: true },
  { id: 'role', field: 'role', title: 'Role', width: 100, sortable: true },
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

<DataGrid 
  data={data} 
  columns={columns}
  enableRowSelection={true}
  enableColumnResize={true}
  pagination={true}
/>`;
      default:
        return `import ${componentItem.name} from '@/components/...';

<${componentItem.name} />`;
    }
  };

  // Sample props for components
  const getComponentProps = (componentName: string) => {
    switch (componentName) {
      case 'data-grid':
      case 'datagrid':
      case 'enhanced-data-grid':
        return {
          data: { type: 'T[]', required: true, default: '[]', description: 'Array of data objects to display' },
          columns: { type: 'GridColumn<T>[]', required: true, default: '[]', description: 'Column definitions' },
          loading: { type: 'boolean', required: false, default: 'false', description: 'Shows loading state' },
          enableRowSelection: { type: 'boolean', required: false, default: 'true', description: 'Enables row selection' },
          enableColumnResize: { type: 'boolean', required: false, default: 'true', description: 'Enables column resizing' },
          pagination: { type: 'boolean', required: false, default: 'true', description: 'Enables pagination' },
          pageSize: { type: 'number', required: false, default: '100', description: 'Number of rows per page' },
          onRowClick: { type: '(row: T) => void', required: false, default: 'undefined', description: 'Row click handler' },
          onSelectionChange: { type: '(rows: T[]) => void', required: false, default: 'undefined', description: 'Selection change handler' },
        };
      default:
        return {};
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Enhanced Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          Components
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to={`/category/${categoryId}`}
          className="hover:text-foreground transition-colors"
        >
          {categoryData.title}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          {componentItem.name || componentItem.title}
        </span>
      </nav>

      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {componentItem.name || componentItem.title}
                  </h1>
                  <Badge variant="outline" className="text-xs">
                    v1.0
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                  {componentItem.description || 'Professional component with modern design'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Status and Features */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant={getStatusColor(componentItem.status)} className="px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            {isReady ? 'Production Ready' : componentItem.status || 'Coming Soon'}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="w-3 h-3 mr-1" />
            TypeScript
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Palette className="w-3 h-3 mr-1" />
            Responsive
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Accessible
          </Badge>
        </div>

        {/* Quick Actions */}
        {isReady && (
          <div className="flex gap-3">
            <Button
              className="bg-gradient-to-r from-primary to-primary/90"
              onClick={() => copyToClipboard(getUsageCode(componentKey), 'basic-usage')}
            >
              <Download className="mr-2 h-4 w-4" />
              {copiedCode === 'basic-usage' ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Source
            </Button>
          </div>
        )}
      </div>

      {isReady ? (
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="props" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Properties
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Live Interactive Demo
                </CardTitle>
                <CardDescription>
                  Fully functional component with all features enabled. Try interacting with it below.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6">
                  <Component />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Basic Usage
                </CardTitle>
                <CardDescription>
                  Copy and paste this code to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">Import and Usage</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(getUsageCode(componentKey), 'usage')}
                    className="hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === 'usage' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="relative">
                  <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                    <code>{getUsageCode(componentKey)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Props Tab */}
          <TabsContent value="props" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Component Properties
                </CardTitle>
                <CardDescription>
                  Configuration options for the component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary/20">
                        <th className="text-left p-4 font-semibold bg-muted/30">Property</th>
                        <th className="text-left p-4 font-semibold bg-muted/30">Type</th>
                        <th className="text-left p-4 font-semibold bg-muted/30">Required</th>
                        <th className="text-left p-4 font-semibold bg-muted/30">Default</th>
                        <th className="text-left p-4 font-semibold bg-muted/30">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(getComponentProps(componentKey)).map(([key, prop]) => (
                        <tr key={key} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-mono text-sm font-medium text-primary">{key}</td>
                          <td className="p-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                            {prop.type}
                          </td>
                          <td className="p-4">
                            <Badge variant={prop.required ? 'destructive' : 'secondary'} className="text-xs">
                              {prop.required ? 'Required' : 'Optional'}
                            </Badge>
                          </td>
                          <td className="p-4 font-mono text-sm text-muted-foreground">
                            {prop.default || '-'}
                          </td>
                          <td className="p-4 text-sm leading-relaxed">{prop.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Enhanced Coming Soon State
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Code2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Component Coming Soon</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              We're working hard to bring you this amazing component with all the features you need.
              It will include comprehensive documentation, live examples, and full TypeScript support.
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {categoryData.title}
              </Button>
              <Link to="/category/data-display">
                <Button>
                  View Ready Components
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
