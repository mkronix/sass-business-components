
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  FormInput, 
  Navigation, 
  MessageSquare, 
  BarChart3, 
  FileImage,
  ArrowRight,
  Code,
  Palette,
  Responsive
} from 'lucide-react';

const featuredCategories = [
  {
    id: 'data-display',
    title: 'Data Display',
    description: 'Tables, grids, and data visualization components',
    icon: Table,
    componentCount: 1,
    status: 'active'
  },
  {
    id: 'form',
    title: 'Form Components',
    description: 'Input fields, validation, and form handling',
    icon: FormInput,
    componentCount: 0,
    status: 'coming-soon'
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Menus, breadcrumbs, and navigation elements',
    icon: Navigation,
    componentCount: 0,
    status: 'coming-soon'
  },
  {
    id: 'feedback',
    title: 'Feedback & Communication',
    description: 'Alerts, notifications, and messaging components',
    icon: MessageSquare,
    componentCount: 0,
    status: 'coming-soon'
  },
  {
    id: 'charts',
    title: 'Chart & Analytics',
    description: 'Data visualization and analytics components',
    icon: BarChart3,
    componentCount: 0,
    status: 'coming-soon'
  },
  {
    id: 'media',
    title: 'Media & Document',
    description: 'File upload, media players, and document viewers',
    icon: FileImage,
    componentCount: 0,
    status: 'coming-soon'
  }
];

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            Business SaaS Component Library
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Sophisticated, responsive, and bug-free components for enterprise applications. 
            Build modern SaaS interfaces with confidence.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">TypeScript Ready</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Responsive className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Fully Responsive</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Dark/Light Mode</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">23</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">1</div>
            <div className="text-sm text-muted-foreground">Components Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Responsive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">∞</div>
            <div className="text-sm text-muted-foreground">Customizable</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <Badge 
                      variant={category.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {category.status === 'active' ? 'Active' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.componentCount} component{category.componentCount !== 1 ? 's' : ''}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link to={`/category/${category.id}`}>
                        Explore <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Start */}
      <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-4">
            Explore our comprehensive component library and start building amazing interfaces.
          </p>
          <Button asChild>
            <Link to="/category/data-display">
              View Components <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
