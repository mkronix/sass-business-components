
export { DataGrid } from './DataGrid';
export { DataGridCard } from './DataGridCard';
export { DataGridToolbar } from './DataGridToolbar';
export { FilterModal } from './FilterModal';
export { ContextMenu } from './ContextMenu';
export { useDataGridState } from './useDataGridState';
export * from './types';

// Sample data generator for demo purposes
export const generateSampleData = (count: number) => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const statuses = ['Active', 'Inactive', 'On Leave', 'Pending'];
    const roles = ['Manager', 'Developer', 'Analyst', 'Coordinator', 'Specialist', 'Director'];
    
    return Array.from({ length: count }, (_, i) => ({
        id: `emp-${i + 1}`,
        name: `Employee ${i + 1}`,
        firstName: `First${i + 1}`,
        lastName: `Last${i + 1}`,
        email: `employee${i + 1}@company.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        salary: Math.floor(Math.random() * 100000) + 40000,
        hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        performance: Math.floor(Math.random() * 100) + 1,
        projects: Math.floor(Math.random() * 10),
        tags: ['React', 'TypeScript', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1)
    }));
};
