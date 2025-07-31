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
import DataTable from '@/components/DataTable/DataTable';
import TableDocs from '@/data/documentation/data-display/data-table.json';

const componentMap: Record<string, {
  component: React.ComponentType;
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
                    {docs.title || componentItem.name || componentItem.title}
                  </h1>
                  {docs.version && (
                    <Badge variant="outline" className="text-xs">
                      v{docs.version}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg">
                  {docs.description || componentItem.description || 'Professional component with modern design'}
                </p>
                {docs.lastUpdated && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {formatDate(docs.lastUpdated)}
                  </p>
                )}
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
          {docs.dependencies?.required && (
            <Badge variant="outline" className="px-3 py-1">
              <Package className="w-3 h-3 mr-1" />
              {Object.keys(docs.dependencies.required).length} Dependencies
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        {isReady && (
          <div className="flex gap-3">
            <Button
              className="bg-gradient-to-r from-primary to-primary/90"
              onClick={() => copyToClipboard(docs.usage?.basic || '', 'basic-usage')}
            >
              <Download className="mr-2 h-4 w-4" />
              {copiedCode === 'basic-usage' ? 'Copied!' : 'Copy Code'}
            </Button>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Source
            </Button>
            {docs.migration && (
              <Button variant="outline">
                <GitBranch className="mr-2 h-4 w-4" />
                Migration Guide
              </Button>
            )}
          </div>
        )}
      </div>

      {isReady ? (
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
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
              API
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="styling" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Styling
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Guides
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

            {/* Enhanced Features Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Key Features ({docs.features?.length || 0})
                </CardTitle>
                <CardDescription>
                  Everything this component offers out of the box
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            {/* Performance & Accessibility Info */}
            {(docs.performance || docs.accessibility) && (
              <div className="grid md:grid-cols-2 gap-6">
                {docs.performance && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {docs.performance.optimization?.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </div>
                        )) || []}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {docs.accessibility && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Accessibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {docs.accessibility.keyboardShortcuts && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Keyboard className="h-4 w-4" />
                              Keyboard Shortcuts
                            </h4>
                            <div className="space-y-1 text-sm">
                              {Object.entries(docs.accessibility.keyboardShortcuts).map(([key, description]) => (
                                <div key={key} className="flex justify-between">
                                  <code className="bg-muted px-1 rounded text-xs">{key}</code>
                                  <span className="text-muted-foreground">{description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Enhanced Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Installation
                </CardTitle>
                <CardDescription>
                  Get started with this component in your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dependencies */}
                {docs.dependencies && (
                  <div>
                    <h4 className="font-semibold mb-3">Dependencies</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">Required</h5>
                        <div className="space-y-1">
                          {Object.entries(docs.dependencies.required || {}).map(([pkg, version]) => (
                            <div key={pkg} className="flex justify-between text-sm">
                              <code className="text-primary">{pkg}</code>
                              <code className="text-muted-foreground">{version}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                      {docs.dependencies.optional && (
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">Optional</h5>
                          <div className="space-y-1">
                            {Object.entries(docs.dependencies.optional).map(([pkg, description]) => (
                              <div key={pkg} className="text-sm">
                                <code className="text-primary">{pkg}</code>
                                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Usage Examples */}
                {Object.entries(docs.usage || {}).map(([key, code]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()} Usage
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code, key)}
                        className="hover:bg-primary/10"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedCode === key ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Props Tab */}
          <TabsContent value="props" className="space-y-6">
            <div className="grid gap-6">
              {/* Main Props */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Component Properties
                  </CardTitle>
                  <CardDescription>
                    Main configuration options for the component
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
                        {Object.entries(docs.props || {}).map(([key, prop]: [string, any]) => (
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

              {/* Column Props (if exists) */}
              {docs.columnProps && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Column Configuration
                    </CardTitle>
                    <CardDescription>
                      Properties for configuring table columns
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
                          {Object.entries(docs.columnProps).map(([key, prop]: [string, any]) => (
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
              )}

              {/* Hooks (if exists) */}
              {docs.hooks && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Related Hooks
                    </CardTitle>
                    <CardDescription>
                      Custom hooks that work with this component
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(docs.hooks).map(([hookName, hookInfo]: [string, any]) => (
                        <div key={hookName} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{hookName}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{hookInfo.description}</p>
                          <div className="bg-muted/30 rounded p-3">
                            <code className="text-sm">{hookInfo.usage}</code>
                          </div>
                          {hookInfo.returns && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium mb-2">Returns:</h5>
                              <div className="space-y-1">
                                {Object.entries(hookInfo.returns).map(([key, description]) => (
                                  <div key={key} className="text-sm flex gap-2">
                                    <code className="text-primary">{key}:</code>
                                    <span className="text-muted-foreground">{description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Enhanced Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            {docs.examples?.map((example: any, index: number) => (
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
                      onClick={() => copyToClipboard(example.code, `example-${index}`)}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copiedCode === `example-${index}` ? 'Copied!' : 'Copy'}
                    </Button>
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-6 rounded-xl overflow-x-auto text-sm border border-slate-800 max-h-96">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )) || []}
          </TabsContent>

          {/* Styling Tab */}
          <TabsContent value="styling" className="space-y-6">
            <div className="grid gap-6">
              {/* CSS Variables */}
              {docs.styling?.cssVariables && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      CSS Custom Properties
                    </CardTitle>
                    <CardDescription>
                      Customize the component appearance using CSS variables
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(docs.styling.cssVariables).map(([variable, description]) => (
                        <div key={variable} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                          <code className="text-primary font-medium">{variable}</code>
                          <span className="text-sm text-muted-foreground">{description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Custom Classes */}
              {docs.styling?.customClasses && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Utility Classes
                    </CardTitle>
                    <CardDescription>
                      Pre-built classes for quick styling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(docs.styling.customClasses).map(([className, description]) => (
                        <div key={className} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                          <code className="text-primary font-medium">.{className}</code>
                          <span className="text-sm text-muted-foreground">{description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6">
              {/* Migration Guide */}
              {docs.migration && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      Migration Guide
                    </CardTitle>
                    <CardDescription>
                      How to migrate from previous versions or similar components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(docs.migration).map(([migrationKey, migrationInfo]: [string, any]) => (
                      <div key={migrationKey} className="space-y-4">
                        <h4 className="font-semibold capitalize">
                          {migrationKey.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>

                        {migrationInfo.breakingChanges && (
                          <div>
                            <h5 className="text-sm font-medium text-destructive mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Breaking Changes
                            </h5>
                            <ul className="space-y-1 ml-4">
                              {migrationInfo.breakingChanges.map((change: string, index: number) => (
                                <li key={index} className="text-sm text-muted-foreground list-disc">
                                  {change}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {migrationInfo.newFeatures && (
                          <div>
                            <h5 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              New Features
                            </h5>
                            <ul className="space-y-1 ml-4">
                              {migrationInfo.newFeatures.map((feature: string, index: number) => (
                                <li key={index} className="text-sm text-muted-foreground list-disc">
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Troubleshooting */}
              {docs.troubleshooting && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Troubleshooting
                    </CardTitle>
                    <CardDescription>
                      Common issues and their solutions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {docs.troubleshooting.commonIssues?.map((issue: any, index: number) => (
                        <Alert key={index}>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p className="font-medium">{issue.issue}</p>
                              <p className="text-sm text-muted-foreground">{issue.solution}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )) || []}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Recommendations */}
              {docs.performance?.recommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Performance Tips
                    </CardTitle>
                    <CardDescription>
                      Best practices for optimal performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {docs.performance.recommendations.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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

            {/* Progress Indicator */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Development Progress</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-1/4 transition-all duration-300"></div>
              </div>
            </div>

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
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Get Notified
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Navigation Footer */}
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

              {/* Quick Stats */}
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
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Collection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="mt-6 border-dashed">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold mb-2">Help Us Improve</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Found an issue or have suggestions? We'd love to hear from you.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" />
              Request Feature
            </Button>
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              Improve Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}