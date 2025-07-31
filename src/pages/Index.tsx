
import { DataTableDemo } from '@/components/DataTable/DataTableDemo';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Business SaaS Component Library</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Sophisticated, responsive, and bug-free components for enterprise applications
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Data Display Components
            </span>
            <span className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm">
              Dark/Light Mode
            </span>
            <span className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm">
              Fully Responsive
            </span>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">1. Data Display Components</h2>
            <DataTableDemo />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
