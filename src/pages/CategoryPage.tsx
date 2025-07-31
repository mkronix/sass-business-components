
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react';
import { components } from '@/data/components';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  if (!categoryId || !components[categoryId]) {
    return (
      <div className="container mx-auto px-4 py-8 bg-primary-custom min-h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-custom mb-4">Category Not Found</h1>
          <p className="text-secondary-custom mb-4">The requested category does not exist.</p>
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

  return (
    <div className="container mx-auto px-4 py-8 bg-primary-custom min-h-full">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4 text-primary-custom hover-primary-custom">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary-custom/10">
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-custom">{category.name}</h1>
            <p className="text-secondary-custom">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="space-y-8">
        {Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => (
          <div key={subcategoryId} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-primary-custom">{subcategory.name}</h2>
              <Badge variant="outline" className="border-primary-custom text-primary-custom">
                {subcategory.components.length} component{subcategory.components.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <p className="text-secondary-custom">{subcategory.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategory.components.map((component) => (
                <Card key={component.id} className="group hover:shadow-primary-custom transition-all duration-300 bg-secondary-custom border-primary-custom">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-primary-custom">{component.name}</CardTitle>
                        <CardDescription className="text-secondary-custom mt-1">
                          {component.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={component.status === 'stable' ? 'default' : 'secondary'}
                        className={component.status === 'stable' ? 'accent-primary-custom text-white' : 'bg-secondary-custom/20 text-secondary-custom'}
                      >
                        {component.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {component.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" size="sm" className="text-xs border-secondary-custom text-secondary-custom">
                            {tag}
                          </Badge>
                        ))}
                        {component.tags.length > 3 && (
                          <Badge variant="outline" size="sm" className="text-xs border-secondary-custom text-secondary-custom">
                            +{component.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/categories/${categoryId}/${subcategoryId}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full border-primary-custom text-primary-custom hover-primary-custom">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        {component.demoUrl && (
                          <Button variant="outline" size="sm" className="border-primary-custom text-primary-custom hover-primary-custom">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
