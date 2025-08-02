
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Info,
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

const componentMap: Record<string, {
  component: React.ComponentType;
}> = {
  'enhanced-data-table': {
    component: DataTable
  },
  'data-table': {
    component: DataTable
  },
  'datatable': {
    component: DataTable
  },
  'data-grid': {
    component: DataGrid
  },
  'datagrid': {
    component: DataGrid
  },
  'enhanced-data-grid': {
    component: DataGrid
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
  const componentInfo = componentMap[componentKey];

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

  if (!componentInfo) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Code2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Component Coming Soon</h1>
          <p className="text-muted-foreground mb-8">
            This component is being developed and will be available soon.
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

  const { component: Component } = componentInfo;
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

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Breadcrumb */}
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

      {/* Header */}
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
                </div>
                <p className="text-muted-foreground text-lg">
                  {componentItem.description || 'Professional component with modern design'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Features */}
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
              onClick={() => copyToClipboard(`import ${Component.name} from '@/components/data-display/${componentKey}/${Component.name}';`, 'import')}
            >
              <Download className="mr-2 h-4 w-4" />
              {copiedCode === 'import' ? 'Copied!' : 'Copy Import'}
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
            <TabsTrigger value="code" className="flex items-center gap-2">
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

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Key Features
                </CardTitle>
                <CardDescription>
                  Everything this component offers out of the box
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {componentItem.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  )) || [
                    <div key="responsive" className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm font-medium">Fully Responsive</span>
                    </div>,
                    <div key="accessible" className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm font-medium">Accessible</span>
                    </div>,
                    <div key="typescript" className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm font-medium">TypeScript Support</span>
                    </div>
                  ]}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Basic Usage
                </CardTitle>
                <CardDescription>
                  Get started with this component in your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">Import</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`import ${Component.name} from '@/components/data-display/${componentKey}/${Component.name}';`, 'import-code')}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedCode === 'import-code' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                      <code>{`import ${Component.name} from '@/components/data-display/${componentKey}/${Component.name}';`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">Example Usage</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`<${Component.name} />`, 'usage-code')}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedCode === 'usage-code' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                      <code>{`<${Component.name} />`}</code>
                    </pre>
                  </div>
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
                  Available props and their descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-12 w-12 mx-auto mb-4" />
                  <p>Property documentation is available in the component's TypeScript interface.</p>
                  <p className="text-sm mt-2">Check the types.ts file for detailed prop definitions.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Coming Soon State
        <Card className="border-dashed border-2">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Code2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Component Coming Soon</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              We're working hard to bring you this amazing component with all the features you need.
              It will include comprehensive functionality and full TypeScript support.
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

      {/* Navigation Footer */}
      <Card className="mt-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Explore More Components
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Discover other professional components in our library
              </p>

              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">50+</span>
                  <span className="text-muted-foreground">Components</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">TypeScript</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Accessible</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link to={`/category/${categoryId}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {categoryData.title}
                </Button>
              </Link>
              <Link to="/">
                <Button>
                  Explore All Categories
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
