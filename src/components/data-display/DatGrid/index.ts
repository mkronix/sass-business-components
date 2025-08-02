
export { default as DataGrid } from './DataGrid';
export type { CellRendererParams, ColumnState, DataGridProps, FilterConfig, SortConfig, GridApi, GridColumn } from './types';



// Sample data for demo
const generateSampleData = (count: number = 1000) => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Specialist', 'Director'];
    const statuses = ['Active', 'Inactive', 'On Leave', 'Pending'];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@company.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        salary: Math.floor(Math.random() * 100000) + 40000,
        hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        performance: Math.floor(Math.random() * 100),
        projects: Math.floor(Math.random() * 20),
        isManager: Math.random() > 0.8,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        phoneNumber: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        address: `${Math.floor(Math.random() * 9999)} Main St, City ${i % 50}`,
        emergencyContact: `Emergency Contact ${i + 1}`,
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 5) + 1),
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        contractType: ['Full-time', 'Part-time', 'Contract', 'Intern'][Math.floor(Math.random() * 4)]
    }));
};

export { generateSampleData };
