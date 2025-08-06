
export { default as DataGrid } from './DataGrid';
export { default as DataGridDemo } from './DataGridDemo';
export * from './types';

// Export sample data generator for convenience
export const generateSampleData = (count: number) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Pending'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
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

// Export types for external use
export interface GridColumn {
  id: string;
  field: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: { label: string; value: string }[];
}
