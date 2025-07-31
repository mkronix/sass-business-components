import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormInput,
  Navigation,
  Table,
  ExternalLink
} from 'lucide-react';
import components from '@/data/components.json';

const categoryConfig: Record<string, {
  title: string;
  description: string;
  icon: any;
}> = {
  'data-display': {
    title: 'Data Display Components',
    description: 'Components for displaying and organizing data in tables, lists, and other structured formats.',
    icon: Table,
  },
  'form': {
    title: 'Form Components',
    description: 'Input fields, validation, and form handling components.',
    icon: FormInput,
  },
  'navigation': {
    title: 'Navigation Components',
    description: 'Menus, breadcrumbs, tabs, and other navigation elements.',
    icon: Navigation,
  }
  // Other categories will be added as we implement them
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Find the category from the data
  const categoryData = components.find(cat => cat.id === categoryId);
  const categoryInfo = categoryId ? categoryConfig[categoryId] : null;

  if (!categoryData || !categoryInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground">The requested category does not exist.</p>
        </div>
      </div>
    );
  }

  const IconComponent = categoryInfo.icon;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{categoryInfo.title}</h1>
            <p className="text-muted-foreground mt-1">{categoryInfo.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{categoryData.items.length} Components</Badge>
          <Badge variant="outline">Fully Responsive</Badge>
          <Badge variant="outline">Dark/Light Mode</Badge>
        </div>
      </div>

      {categoryData.items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <IconComponent className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground">
              Components for this category are being developed. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryData.items.map((item) => (
            <Card key={item.title} className="group hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <Badge variant={item.title === 'DataTable' ? 'default' : 'secondary'}>
                    {item.title === 'DataTable' ? 'Ready' : 'Coming Soon'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {item.title === 'DataTable' 
                    ? 'Advanced data table with sorting, filtering, pagination, and export functionality'
                    : 'Coming soon - Advanced component with comprehensive features'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  {item.title === 'DataTable' ? (
                    <Link 
                      to={item.url.replace('/category/', '/categories/')}
                      className="flex-1"
                    >
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        View Component
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full">
                      Coming Soon
                    </Button>
                  )}
                </div>

                {item.title === 'DataTable' && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Responsive</Badge>
                    <Badge variant="outline" className="text-xs">Export</Badge>
                    <Badge variant="outline" className="text-xs">Filtering</Badge>
                    <Badge variant="outline" className="text-xs">Sorting</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
