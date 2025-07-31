
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Palette, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { components } from '@/data/components';

export default function HomePage() {
  const totalComponents = Object.values(components).reduce(
    (total, category) => total + Object.values(category.subcategories).reduce(
      (subTotal, subcategory) => subTotal + subcategory.components.length, 0
    ), 0
  );

  const categories = Object.entries(components);

  return (
    <div className="container mx-auto px-4 py-8 bg-primary-custom min-h-full">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary-custom">
          Component Library
        </h1>
        <p className="text-xl text-secondary-custom mb-8 max-w-2xl mx-auto">
          A comprehensive collection of reusable UI components built with React, TypeScript, and Tailwind CSS.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="outline" className="text-sm py-2 px-4 border-primary-custom text-primary-custom">
            <Code className="w-4 h-4 mr-2" />
            {totalComponents} Components
          </Badge>
          <Badge variant="outline" className="text-sm py-2 px-4 border-primary-custom text-primary-custom">
            <Palette className="w-4 h-4 mr-2" />
            Fully Customizable
          </Badge>
          <Badge variant="outline" className="text-sm py-2 px-4 border-primary-custom text-primary-custom">
            <Zap className="w-4 h-4 mr-2" />
            TypeScript Ready
          </Badge>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map(([categoryId, category]) => {
          const componentCount = Object.values(category.subcategories).reduce(
            (total, subcategory) => total + subcategory.components.length, 0
          );

          return (
            <Card key={categoryId} className="group hover:shadow-primary-custom transition-all duration-300 bg-secondary-custom border-primary-custom">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary-custom/10">
                    {category.icon}
                  </div>
                  <Badge variant="secondary" className="bg-primary-custom/20 text-primary-custom">
                    {componentCount} components
                  </Badge>
                </div>
                <CardTitle className="text-xl text-primary-custom">{category.name}</CardTitle>
                <CardDescription className="text-secondary-custom">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(category.subcategories).slice(0, 3).map(([subId, subcategory]) => (
                      <Badge key={subId} variant="outline" className="text-xs border-secondary-custom text-secondary-custom">
                        {subcategory.name}
                      </Badge>
                    ))}
                    {Object.keys(category.subcategories).length > 3 && (
                      <Badge variant="outline" className="text-xs border-secondary-custom text-secondary-custom">
                        +{Object.keys(category.subcategories).length - 3} more
                      </Badge>
                    )}
                  </div>
                  <Link to={`/category/${categoryId}`}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-primary-custom hover-primary-custom group-hover:accent-primary-custom"
                    >
                      Explore {category.name}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary-custom">Why Choose Our Components?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-secondary-custom border-primary-custom">
            <CardHeader>
              <Palette className="w-8 h-8 mx-auto text-primary-custom mb-2" />
              <CardTitle className="text-primary-custom">Fully Customizable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-custom">
                Every component can be themed and styled to match your brand perfectly.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary-custom border-primary-custom">
            <CardHeader>
              <Code className="w-8 h-8 mx-auto text-primary-custom mb-2" />
              <CardTitle className="text-primary-custom">Developer Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-custom">
                Built with TypeScript, well-documented, and easy to integrate.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary-custom border-primary-custom">
            <CardHeader>
              <Zap className="w-8 h-8 mx-auto text-primary-custom mb-2" />
              <CardTitle className="text-primary-custom">Production Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-custom">
                Tested, accessible, and optimized for performance in real applications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
