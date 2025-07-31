
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Code, FileText, Eye } from 'lucide-react';
import { components } from '@/data/components';
import { DataTableDemo } from '@/components/DataTable/DataTableDemo';

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ 
    categoryId: string; 
    subcategoryId: string; 
  }>();
  
  if (!categoryId || !subcategoryId || !components[categoryId]?.subcategories[subcategoryId]) {
    return (
      <div className="container mx-auto px-4 py-8 bg-primary-custom min-h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-custom mb-4">Page Not Found</h1>
          <p className="text-secondary-custom mb-4">The requested component page does not exist.</p>
          <Link to="/">
            <Button className="accent-primary-custom text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = components[categoryId];
  const subcategory = category.subcategories[subcategoryId];

  // For now, we'll render the DataTable demo if it's the data-table component
  const renderComponentDemo = (componentId: string) => {
    switch (componentId) {
      case 'data-table':
        return <DataTableDemo />;
      default:
        return (
          <div className="text-center py-12 bg-secondary-custom rounded-lg border border-primary-custom">
            <Code className="w-12 h-12 mx-auto text-primary-custom mb-4" />
            <h3 className="text-lg font-semibold text-primary-custom mb-2">Component Demo</h3>
            <p className="text-secondary-custom">Demo for {componentId} will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-primary-custom min-h-full">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-2 text-primary-custom hover-primary-custom">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-sm text-secondary-custom">
          <Link to={`/category/${categoryId}`} className="hover:text-primary-custom">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-primary-custom">{subcategory.name}</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary-custom/10">
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-custom">{subcategory.name}</h1>
            <p className="text-secondary-custom">{subcategory.description}</p>
          </div>
        </div>
      </div>

      {/* Components */}
      <div className="space-y-8">
        {subcategory.components.map((component) => (
          <Card key={component.id} className="bg-secondary-custom border-primary-custom">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-primary-custom">{component.name}</CardTitle>
                  <p className="text-secondary-custom mt-2">{component.description}</p>
                </div>
                <Badge 
                  variant={component.status === 'stable' ? 'default' : 'secondary'}
                  className={component.status === 'stable' ? 'accent-primary-custom text-white' : 'bg-secondary-custom/20 text-secondary-custom'}
                >
                  {component.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {component.tags.map((tag) => (
                  <Badge key={tag} variant="outline" size="sm" className="border-secondary-custom text-secondary-custom">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-primary-custom/5">
                  <TabsTrigger value="demo" className="text-primary-custom">
                    <Eye className="w-4 h-4 mr-2" />
                    Demo
                  </TabsTrigger>
                  <TabsTrigger value="code" className="text-primary-custom">
                    <Code className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="text-primary-custom">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="demo" className="mt-6">
                  {renderComponentDemo(component.id)}
                </TabsContent>
                
                <TabsContent value="code" className="mt-6">
                  <div className="bg-primary-custom/5 rounded-lg p-4 border border-primary-custom">
                    <p className="text-secondary-custom">Code examples will be available soon.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="docs" className="mt-6">
                  <div className="bg-primary-custom/5 rounded-lg p-4 border border-primary-custom">
                    <p className="text-secondary-custom">Documentation will be available soon.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
