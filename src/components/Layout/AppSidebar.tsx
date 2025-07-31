
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
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const categories = [
  {
    id: 'data-display',
    title: 'Data Display',
    icon: Table,
    items: [
      { title: 'DataTable', path: '/components/data-display/data-table' },
    ]
  },
  {
    id: 'form',
    title: 'Form Components',
    icon: FormInput,
    items: []
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: Navigation,
    items: []
  },
  {
    id: 'feedback',
    title: 'Feedback & Communication',
    icon: MessageSquare,
    items: []
  },
  {
    id: 'charts',
    title: 'Chart & Analytics',
    icon: BarChart3,
    items: []
  },
  {
    id: 'media',
    title: 'Media & Document',
    icon: FileImage,
    items: []
  },
  {
    id: 'business-logic',
    title: 'Business Logic',
    icon: Briefcase,
    items: []
  },
  {
    id: 'utility',
    title: 'Utility',
    icon: Wrench,
    items: []
  },
  {
    id: 'pwa',
    title: 'PWA-Specific',
    icon: Smartphone,
    items: []
  },
  {
    id: 'industry',
    title: 'Industry-Specific',
    icon: Building,
    items: []
  },
  {
    id: 'messaging',
    title: 'Communication & Messaging',
    icon: MessageCircle,
    items: []
  },
  {
    id: 'integration',
    title: 'Integration & API',
    icon: Plug,
    items: []
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: Shield,
    items: []
  },
  {
    id: 'reporting',
    title: 'Reporting & Analytics',
    icon: FileText,
    items: []
  },
  {
    id: 'user-experience',
    title: 'User Experience',
    icon: User,
    items: []
  },
  {
    id: 'mobile',
    title: 'Mobile-Specific',
    icon: Monitor,
    items: []
  },
  {
    id: 'advanced-business',
    title: 'Advanced Business',
    icon: Zap,
    items: []
  },
  {
    id: 'automation',
    title: 'Automation & AI',
    icon: Bot,
    items: []
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    icon: Users,
    items: []
  },
  {
    id: 'quality',
    title: 'Quality & Testing',
    icon: TestTube,
    items: []
  },
  {
    id: 'location',
    title: 'Location & Mapping',
    icon: MapPin,
    items: []
  },
  {
    id: 'accessibility',
    title: 'Accessibility & Localization',
    icon: Globe,
    items: []
  },
  {
    id: 'performance',
    title: 'Performance & Monitoring',
    icon: Activity,
    items: []
  }
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar 
      className="border-r transition-all duration-300 ease-in-out"
      collapsible="icon"
    >
      <SidebarContent className="gap-0">
        {categories.map((category) => (
          <SidebarGroup key={category.id} className="px-2 py-1">
            <SidebarGroupLabel className={`px-2 py-3 text-xs font-medium text-muted-foreground transition-opacity ${!open ? 'opacity-0' : 'opacity-100'}`}>
              {category.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={!open ? category.title : undefined}
                    className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <NavLink 
                      to={`/category/${category.id}`}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <category.icon className="h-4 w-4 shrink-0" />
                      <span className={`truncate transition-opacity ${!open ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        {category.title}
                      </span>
                      {category.items.length > 0 && (
                        <span className={`ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full transition-opacity ${!open ? 'opacity-0 w-0' : 'opacity-100'}`}>
                          {category.items.length}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
