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
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested category does not exist or is not available yet.</p>
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
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {categoryData.title}
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Professional components for modern applications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="default" className="px-3 py-1">
            {categoryData.items.length} Component{categoryData.items.length !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Palette className="w-3 h-3 mr-1" />
            Dark/Light Mode
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Monitor className="w-3 h-3 mr-1" />
            Fully Responsive
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Code2 className="w-3 h-3 mr-1" />
            TypeScript Ready
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{categoryData.items.length}</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">
                {categoryData.items.filter(item => item.status === 'ready').length}
              </div>
              <div className="text-sm text-muted-foreground">Ready</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">
                {categoryData.items.filter(item => !item.status || item.status !== 'ready').length}
              </div>
              <div className="text-sm text-muted-foreground">Coming Soon</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">100%</div>
              <div className="text-sm text-muted-foreground">Responsive</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Components Grid */}
      {categoryData.items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Code2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Components Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're working hard to bring you amazing components for this category.
              Check back soon for updates!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Available Components</h2>
            <div className="text-sm text-muted-foreground">
              Click on any component to view details and live demo
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categoryData.items.map((item, index) => {
              const isReady = item.status === 'ready';
              const componentUrl = item.url?.replace('/category/', '/categories/') ||
                `/categories/${categoryId}/${item.name?.toLowerCase().replace(/\s+/g, '-') || item.title?.toLowerCase().replace(/\s+/g, '-')}`;

              return (
                <Card
                  key={item.name || item.title || index}
                  className={`group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isReady
                      ? 'hover:shadow-primary/20 border-primary/20'
                      : 'opacity-75 hover:opacity-100'
                    }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isReady
                            ? 'bg-primary/10 group-hover:bg-primary/20'
                            : 'bg-muted group-hover:bg-muted/80'
                          } transition-colors`}>
                          <Code2 className={`h-5 w-5 ${isReady ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {item.name || item.title}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge
                        variant={isReady ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {isReady ? 'Ready' : 'Coming Soon'}
                      </Badge>
                    </div>

                    <CardDescription className="text-sm leading-relaxed">
                      {item.description ||
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
                        <Badge variant="outline" className="text-xs">Responsive</Badge>
                        <Badge variant="outline" className="text-xs">Accessible</Badge>
                        <Badge variant="outline" className="text-xs">Customizable</Badge>
                        {item.name === 'DataTable' && (
                          <>
                            <Badge variant="outline" className="text-xs">Export</Badge>
                            <Badge variant="outline" className="text-xs">Filtering</Badge>
                          </>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {isReady ? (
                        <Link to={componentUrl} className="flex-1">
                          <Button className="w-full group-hover:bg-primary/90 transition-colors">
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

      {/* Bottom CTA */}
      <Card className="mt-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to Build Something Amazing?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            These components are designed to help you build professional, scalable applications faster.
            Each component includes comprehensive documentation and live examples.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Explore More Categories
              </Link>
            </Button>
            {categoryData.items.some(item => item.status === 'ready') && (
              <Button variant="outline" asChild>
                <Link to={categoryData.items.find(item => item.status === 'ready')?.url?.replace('/category/', '/categories/') || '#'}>
                  Try Live Demo
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}