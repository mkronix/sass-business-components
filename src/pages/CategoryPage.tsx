
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ExternalLink, Code2, Palette, Monitor } from 'lucide-react';
import COMPONENTS from '@/data/components'; // Import from your components file

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Find the category from the COMPONENTS data
  const categoryData = COMPONENTS.find(cat => cat.id === categoryId);

  if (!categoryData) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-secondary-custom rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-secondary-custom mb-8">The requested category does not exist or is not available yet.</p>
          <Link to="/">
            <Button>
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-custom/20 to-primary-custom/10 rounded-xl">
                <Code2 className="h-8 w-8 text-primary-custom" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-custom to-primary-custom/70 ">
                  {categoryData.title}
                </h1>
                <p className="text-secondary-custom text-lg mt-1">
                  Professional components for modern applications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="outline" className="px-3 py-1 border-primary-custom">
            {categoryData.items.length} Component{categoryData.items.length !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-primary-custom">
            <Palette className="w-3 h-3 mr-1" />
            Dark/Light Mode
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-primary-custom">
            <Monitor className="w-3 h-3 mr-1" />
            Fully Responsive
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-primary-custom">
            <Code2 className="w-3 h-3 mr-1" />
            TypeScript Ready
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center shadow-primary-custom">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-custom">{categoryData.items.length}</div>
              <div className="text-sm text-secondary-custom">Components</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-primary-custom">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary-custom">
                {categoryData.items.filter(item => {
                  const itemWithStatus = item as any;
                  return itemWithStatus?.status === 'ready';
                }).length}
              </div>
              <div className="text-sm text-secondary-custom">Ready</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-primary-custom">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-custom">
                {categoryData.items.filter(item => {
                  const itemWithStatus = item as any;
                  return !itemWithStatus?.status || itemWithStatus?.status !== 'ready';
                }).length}
              </div>
              <div className="text-sm text-secondary-custom">Coming Soon</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-primary-custom">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary-custom">100%</div>
              <div className="text-sm text-secondary-custom">Responsive</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Components Grid */}
      {categoryData.items.length === 0 ? (
        <Card className="border-dashed border-secondary-custom">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-secondary-custom rounded-full flex items-center justify-center mb-6">
              <Code2 className="h-8 w-8 text-secondary-custom" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Components Coming Soon</h3>
            <p className="text-secondary-custom max-w-md mx-auto">
              We're working hard to bring you amazing components for this category.
              Check back soon for updates!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Available Components</h2>
            <div className="text-sm text-secondary-custom">
              Click on any component to view details and live demo
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryData.items.map((item, index) => {
              const itemWithProps = item as any;
              const isReady = itemWithProps?.status === 'ready';
              const componentUrl = itemWithProps?.url?.replace('/category/', '/categories/') ||
                `/categories/${categoryId}/${(itemWithProps?.name || itemWithProps?.title)?.toLowerCase().replace(/\s+/g, '-')}`;

              return (
                <Card
                  key={itemWithProps?.name || itemWithProps?.title || index}
                  className={`group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] shadow-primary-custom ${isReady
                    ? 'hover:shadow-primary-custom/20 border-primary-custom/20'
                    : 'opacity-75 hover:opacity-100'
                    }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-secondary-custom hover-secondary-custom transition-colors`}>
                          <Code2 className={`h-5 w-5 ${isReady ? 'text-primary-custom' : 'text-secondary-custom'
                            }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {itemWithProps?.name || itemWithProps?.title || 'Component'}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge
                        variant={isReady ? 'outline' : 'secondary'}
                        className={`${isReady ? 'bg-primary-custom' : 'bg-secondary-custom'} text-sm font-medium px-3 py-1`}
                      >
                        {isReady ? 'Ready' : 'Coming Soon'}
                      </Badge>
                    </div>

                    <CardDescription className="text-sm leading-relaxed">
                      {itemWithProps?.description ||
                        (isReady
                          ? 'Advanced component with comprehensive features and responsive design'
                          : 'Professional component coming soon with modern design and functionality'
                        )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Feature badges for ready components */}
                    {isReady && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="outline" className="text-xs border-secondary-custom">Responsive</Badge>
                        <Badge variant="outline" className="text-xs border-secondary-custom">Customizable</Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {isReady ? (
                        <Link to={componentUrl} className="flex-1">
                          <Button className="w-full accent-primary-custom hover-secondary-custom transition-colors">
                            View Component
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full">
                          Coming Soon
                          <Code2 className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
