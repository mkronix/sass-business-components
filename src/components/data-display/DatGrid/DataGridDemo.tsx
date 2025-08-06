
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useState } from "react";
import DataGrid from "./DataGrid";

// Generate sample data function
const generateSampleData = (count: number) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Pending'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1), // Convert to string to match CardData interface
    name: `Employee ${i + 1}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: departments[i % departments.length],
    role: `Role ${i + 1}`,
    salary: 50000 + (i * 1000),
    hireDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1),
    status: statuses[i % statuses.length],
    performance: Math.floor(Math.random() * 100),
    projects: Math.floor(Math.random() * 10),
    tags: [`tag${i % 3}`, `category${i % 2}`]
  }));
};

// Demo Component
const DataGridDemo = () => {
    const [data, setData] = useState(() => generateSampleData(100));
    const [loading, setLoading] = useState(false);

    const handleCellEdit = async (rowId: string, field: string, newValue: any, oldValue: any) => {
        console.log('Cell edited:', { rowId, field, newValue, oldValue });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    };

    const customFooter = (
        <div className="p-6 border-t border-white/10 bg-[#171717]/10">
            <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">
                    Modern bento grid layout with adaptive cards
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Interactive
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                        Auto-adjusting
                    </Badge>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-black">
            <DataGrid
                data={data}
                columns={3} // Use number for columns as expected by DataGrid
                filters={[
                  {
                    key: 'department',
                    label: 'Department',
                    options: [
                      { label: 'Engineering', value: 'Engineering' },
                      { label: 'Marketing', value: 'Marketing' },
                      { label: 'Sales', value: 'Sales' },
                      { label: 'HR', value: 'HR' },
                      { label: 'Finance', value: 'Finance' },
                      { label: 'Operations', value: 'Operations' }
                    ]
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    options: [
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                      { label: 'On Leave', value: 'On Leave' },
                      { label: 'Pending', value: 'Pending' }
                    ]
                  }
                ]}
                onDelete={(card) => {
                  setData(prev => prev.filter(item => item.id !== card.id));
                }}
                onEdit={(card) => console.log('Edit card:', card)}
                contextMenuItems={(card) => [
                  {
                    label: 'View Details',
                    action: (card) => console.log('View details:', card)
                  },
                  {
                    label: 'Archive',
                    action: (card) => console.log('Archive:', card)
                  }
                ]}
                keyboardShortcuts={true}
                className="shadow-2xl"
            />
        </div>
    );
};

export default DataGridDemo;
