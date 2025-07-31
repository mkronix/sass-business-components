
import { useParams } from 'react-router-dom';
import { 
  Table, 
  FormInput, 
  Navigation, 
  MessageSquare, 
  BarChart3, 
  FileImage, 
  Briefcase,
  Wrench,
  Smartphone,
  Building,
  MessageCircle,
  Plug,
  Shield,
  FileText,
  User,
  Monitor,
  Zap,
  Bot,
  Users,
  TestTube,
  MapPin,
  Globe,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTableDemo } from '@/components/DataTable/DataTableDemo';

const categoryConfig: Record<string, {
  title: string;
  description: string;
  icon: any;
  components: Array<{
    name: string;
    description: string;
    status: 'ready' | 'coming-soon';
    component?: React.ComponentType;
  }>;
}> = {
  'data-display': {
    title: 'Data Display Components',
    description: 'Components for displaying and organizing data in tables, lists, and other structured formats.',
    icon: Table,
    components: [
      {
        name: 'DataTable',
        description: 'A comprehensive table with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
        status: 'ready',
        component: DataTableDemo
      }
    ]
  },
  'form': {
    title: 'Form Components',
    description: 'Input fields, validation, and form handling components.',
    icon: FormInput,
    components: []
  },
  'navigation': {
    title: 'Navigation Components',
    description: 'Menus, breadcrumbs, tabs, and other navigation elements.',
    icon: Navigation,
    components: []
  }
  // Add other categories as needed
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? categoryConfig[categoryId] : null;

  if (!category) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground">The requested category does not exist.</p>
        </div>
      </div>
    );
  }

  const IconComponent = category.icon;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.title}</h1>
            <p className="text-muted-foreground mt-1">{category.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{category.components.length} Components</Badge>
          <Badge variant="outline">Fully Responsive</Badge>
          <Badge variant="outline">Dark/Light Mode</Badge>
        </div>
      </div>

      {category.components.length === 0 ? (
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
        <div className="space-y-8">
          {category.components.map((component) => (
            <Card key={component.name} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {component.name}
                      <Badge variant={component.status === 'ready' ? 'default' : 'secondary'}>
                        {component.status === 'ready' ? 'Ready' : 'Coming Soon'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {component.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              {component.component && component.status === 'ready' && (
                <CardContent className="pt-0">
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <component.component />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
