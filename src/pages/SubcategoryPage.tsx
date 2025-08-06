

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Code2
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import COMPONENTS from '@/data/components';

export default function EnhancedSubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();

  const categoryData = COMPONENTS.find(cat => cat.id === categoryId);
  const componentItem = categoryData?.items.find(item => {
    const itemSlug = ((item as any).name || (item as any).title)?.toLowerCase().replace(/\s+/g, '-');
    return itemSlug === subcategoryId || (item as any).url?.includes(subcategoryId || '');
  });

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

  const isReady = (componentItem as any).status === 'ready';
  const componentName = (componentItem as any).name || (componentItem as any).title || 'Component';
  const componentDescription = (componentItem as any).description || 'Professional component with modern design';

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
          {componentName}
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
                    {componentName}
                  </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                  {componentDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReady && (componentItem as any).component ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            {(componentItem as any).component}
          </CardContent>
        </Card>
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

