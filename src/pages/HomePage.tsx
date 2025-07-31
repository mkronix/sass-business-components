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
  Monitor,
  Briefcase,
  Smartphone,
  Shield,
  FileText,
  Users,
  Settings,
  Map,
  Eye,
  Zap,
  Bot,
  Globe,
  Activity
} from 'lucide-react';
import COMPONENTS from '@/data/components';

// Icon mapping for categories
const categoryIcons = {
  'data-display': Table,
  'form': FormInput,
  'navigation': Navigation,
  'feedback': MessageSquare,
  'charts': BarChart3,
  'media': FileImage,
  'business-logic': Briefcase,
  'utility': Settings,
  'pwa': Smartphone,
  'industry': Briefcase,
  'messaging': MessageSquare,
  'integration': Code,
  'security': Shield,
  'reporting': FileText,
  'user-experience': Users,
  'mobile': Smartphone,
  'advanced-business': Briefcase,
  'automation': Bot,
  'collaboration': Users,
  'quality': Settings,
  'location': Map,
  'accessibility': Eye,
  'performance': Activity
};

// Generate featured categories dynamically from COMPONENTS data
const generateFeaturedCategories = () => {
  return COMPONENTS.map(category => {
    // Count ready components
    const readyComponents = category.items.filter(item => item.status === 'ready').length;
    const totalComponents = category.items.length;

    // Determine status based on ready components
    const status = readyComponents > 0 ? 'active' : 'coming-soon';

    return {
      id: category.id,
      title: category.title,
      description: getCategoryDescription(category.id),
      icon: categoryIcons[category.id] || Code,
      componentCount: readyComponents,
      totalComponents: totalComponents,
      status: status,
      url: category.url
    };
  });
};

// Helper function to provide descriptions for categories
const getCategoryDescription = (categoryId) => {
  const descriptions = {
    'data-display': 'Tables, grids, and data visualization components',
    'form': 'Input fields, validation, and form handling',
    'navigation': 'Menus, breadcrumbs, and navigation elements',
    'feedback': 'Alerts, notifications, and messaging components',
    'charts': 'Data visualization and analytics components',
    'media': 'File upload, media players, and document viewers',
    'business-logic': 'Workflow, scheduling, and business process components',
    'utility': 'Helper components for loading, dialogs, and validation',
    'pwa': 'Progressive Web App specific functionality',
    'industry': 'Specialized components for specific industries',
    'messaging': 'Communication and messaging integration',
    'integration': 'API connectors and third-party integrations',
    'security': 'Authentication, authorization, and security features',
    'reporting': 'Report generation and business intelligence',
    'user-experience': 'Onboarding, themes, and user customization',
    'mobile': 'Mobile-optimized interactions and features',
    'advanced-business': 'Enterprise-level business management tools',
    'automation': 'AI-powered and automated workflow components',
    'collaboration': 'Team collaboration and shared workspace tools',
    'quality': 'Testing, surveys, and quality assurance tools',
    'location': 'Maps, geolocation, and location-based services',
    'accessibility': 'Accessibility and internationalization features',
    'performance': 'Monitoring, analytics, and optimization tools'
  };

  return descriptions[categoryId] || 'Professional components for modern applications';
};

// Get featured categories (first 6 or you can customize the selection)
const featuredCategories = generateFeaturedCategories();

// Calculate dynamic stats
const totalCategories = COMPONENTS.length;
const totalReadyComponents = COMPONENTS.reduce((acc, category) => {
  return acc + category.items.filter(item => item.status === 'ready').length;
}, 0);

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
            <Monitor className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Fully Responsive</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Dark/Light Mode</span>
          </div>
        </div>
      </div>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalCategories}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{totalReadyComponents}</div>
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
                      {category.componentCount} of {category.totalComponents} ready
                    </span>
                    <Button asChild variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link to={category.url || `/category/${category.id}`}>
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