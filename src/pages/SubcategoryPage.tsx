
import React from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Copy, ExternalLink, Github } from 'lucide-react';
import { DataTableDemo } from '@/components/DataTable/DataTableDemo';

// Import documentation
import dataTableDocs from '@/data/documentation/data-display/data-table.json';

const componentMap: Record<string, {
  component: React.ComponentType;
  documentation: any;
}> = {
  'data-table': {
    component: DataTableDemo,
    documentation: dataTableDocs
  }
};

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const componentKey = subcategoryId || '';
  const componentInfo = componentMap[componentKey];

  if (!componentInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Component Not Found</h1>
          <p className="text-muted-foreground">The requested component does not exist or is not yet implemented.</p>
        </div>
      </div>
    );
  }

  const { component: Component, documentation: docs } = componentInfo;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-3xl font-bold">{docs.title}</h1>
            <p className="text-muted-foreground mt-1">{docs.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={docs.status === 'ready' ? 'default' : 'secondary'}>
            {docs.status === 'ready' ? 'Ready' : 'Coming Soon'}
          </Badge>
          <Badge variant="outline">Responsive</Badge>
          <Badge variant="outline">Dark/Light Mode</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Interactive component demonstration with all features enabled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-muted/20">
                <Component />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Key capabilities and functionality of this component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {docs.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installation & Usage</CardTitle>
              <CardDescription>
                How to import and use this component in your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Basic Usage</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(docs.usage.basic)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{docs.usage.basic}</code>
                </pre>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Advanced Usage</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(docs.usage.advanced)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{docs.usage.advanced}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Props Tab */}
        <TabsContent value="props" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Props</CardTitle>
              <CardDescription>
                All available props and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Prop</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Required</th>
                      <th className="text-left p-2 font-medium">Default</th>
                      <th className="text-left p-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(docs.props).map(([key, prop]: [string, any]) => (
                      <tr key={key} className="border-b">
                        <td className="p-2 font-mono text-sm">{key}</td>
                        <td className="p-2 font-mono text-sm text-blue-600 dark:text-blue-400">
                          {prop.type}
                        </td>
                        <td className="p-2">
                          <Badge variant={prop.required ? 'destructive' : 'secondary'}>
                            {prop.required ? 'Required' : 'Optional'}
                          </Badge>
                        </td>
                        <td className="p-2 font-mono text-sm text-muted-foreground">
                          {prop.default || '-'}
                        </td>
                        <td className="p-2 text-sm">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          {docs.examples.map((example: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {example.title}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{example.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
