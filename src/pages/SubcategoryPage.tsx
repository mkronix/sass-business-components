import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  ExternalLink,
  ArrowLeft,
  Code2,
  Eye,
  FileText,
  Settings,
  CheckCircle,
  Star,
  Download
} from 'lucide-react';
import { DataTableDemo } from '@/components/DataTable/DataTableDemo';
import COMPONENTS from '@/data/components'; // Import from your components file

// Import documentation
import dataTableDocs from '@/data/documentation/data-display/data-table.json';

const componentMap: Record<string, {
  component: React.ComponentType;
  documentation: any;
}> = {
  'data-table': {
    component: DataTableDemo,
    documentation: dataTableDocs
  },
  'datatable': {
    component: DataTableDemo,
    documentation: dataTableDocs
  }
};

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();

  // Find the category and component from COMPONENTS data
  const categoryData = COMPONENTS.find(cat => cat.id === categoryId);
  const componentItem = categoryData?.items.find(item => {
    const itemSlug = item.name?.toLowerCase().replace(/\s+/g, '-') ||
      item.title?.toLowerCase().replace(/\s+/g, '-');
    return itemSlug === subcategoryId || item.url?.includes(subcategoryId || '');
  });

  const componentKey = subcategoryId || '';
  const componentInfo = componentMap[componentKey] || componentMap['data-table']; // Fallback to DataTable

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link
          to={`/category/${categoryId}`}
          className="hover:text-foreground transition-colors"
        >
          {categoryData.title}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          {componentItem.name || componentItem.title}
        </span>
      </div>

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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {componentItem.name || componentItem.title}
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  {docs.description || componentItem.description || 'Professional component with modern design'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Features */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant={isReady ? 'default' : 'secondary'} className="px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            {isReady ? 'Production Ready' : 'Coming Soon'}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Responsive Design
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Code2 className="w-3 h-3 mr-1" />
            TypeScript
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Settings className="w-3 h-3 mr-1" />
            Fully Customizable
          </Badge>
        </div>

        {/* Quick Actions */}
        {isReady && (
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-primary to-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Copy Code
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="props" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Props
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Examples
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
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-muted rounded-xl p-6 bg-gradient-to-br from-muted/20 to-muted/40">
                  <Component />
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
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
                  {docs.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  Installation & Usage
                </CardTitle>
                <CardDescription>
                  Get started with this component in your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">Basic Implementation</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(docs.usage.basic)}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                      <code>{docs.usage.basic}</code>
                    </pre>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">Advanced Configuration</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(docs.usage.advanced)}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                      <code>{docs.usage.advanced}</code>
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
                  Complete API reference for all available props
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
                      {Object.entries(docs.props).map(([key, prop]: [string, any]) => (
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

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            {docs.examples.map((example: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {example.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(example.code)}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              It will include comprehensive documentation, live examples, and full TypeScript support.
            </p>
            <div className="flex justify-center gap-3">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-semibold mb-2">Explore More Components</h4>
              <p className="text-sm text-muted-foreground">
                Discover other professional components in our library
              </p>
            </div>
            <div className="flex gap-3">
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