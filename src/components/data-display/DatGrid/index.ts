export { default as DataGrid } from './DataGrid';
export type {
    CellRendererParams,
    ColumnState,
    DataGridProps,
    FilterConfig,
    SortConfig,
    GridApi,
    GridColumn,
    ViewMode,
    GridSize,
    DensityMode,
    AnimationVariants,
    ContextMenuItem,
    FilterPanelConfig,
    CustomFilter,
    ExportConfig,
    BulkOperation,
    GridConfig,
    SearchConfig,
    PerformanceMetrics
} from './types';

// Enhanced sample data generator for bento grid
const generateSampleData = (count: number = 100) => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'];
    const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Specialist', 'Director', 'Lead', 'Coordinator'];
    const statuses = ['Active', 'Inactive', 'On Leave', 'Pending'];
    const contractTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];
    const locations = ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin', 'Toronto', 'Sydney', 'Singapore'];

    // Names for more realistic data
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River',
        'Phoenix', 'Rowan', 'Skyler', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Indigo', 'Jules'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

    return Array.from({ length: count }, (_, i) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const contractType = contractTypes[Math.floor(Math.random() * contractTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];

        // More realistic salary based on role and department
        const baseSalary = role.includes('Director') ? 150000 :
            role.includes('Manager') || role.includes('Lead') ? 120000 :
                role.includes('Developer') || role.includes('Designer') ? 90000 : 70000;
        const salary = baseSalary + (Math.random() * 50000) - 25000;

        // Realistic hire date (within last 5 years)
        const hireDate = new Date();
        hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 5));
        hireDate.setMonth(Math.floor(Math.random() * 12));
        hireDate.setDate(Math.floor(Math.random() * 28) + 1);

        // Last login (within last 30 days for active users)
        const lastLogin = new Date();
        if (status === 'Active') {
            lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 7));
        } else {
            lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 30) - 7);
        }

        return {
            id: i + 1,
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
            department,
            role,
            salary: Math.round(salary),
            hireDate,
            status,
            performance: Math.floor(Math.random() * 40) + 60, // 60-100%
            projects: Math.floor(Math.random() * 15) + 1,
            isManager: role.includes('Manager') || role.includes('Director') || role.includes('Lead'),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
            phoneNumber: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            address: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Maple', 'Cedar'][Math.floor(Math.random() * 5)]} St, ${location}`,
            emergencyContact: `Emergency Contact ${i + 1}`,
            skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'PostgreSQL']
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 2),
            lastLogin,
            contractType,
            location,
            // Additional fields for richer card display
            bio: `${role} in ${department} with ${Math.floor(Math.random() * 10) + 1} years of experience.`,
            timezone: ['EST', 'PST', 'GMT', 'JST', 'CET'][Math.floor(Math.random() * 5)],
            workingHours: `${Math.floor(Math.random() * 3) + 8}:00 AM - ${Math.floor(Math.random() * 3) + 5}:00 PM`,
            nextReview: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
            // Social links for demo
            linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
            github: role.includes('Developer') || role.includes('Engineer') ?
                `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null,
            // Team and reporting structure
            teamSize: Math.floor(Math.random() * 10) + 1,
            reportsTo: i > 10 ? Math.floor(Math.random() * 10) + 1 : null,
            // Equipment and assets
            equipment: ['MacBook Pro', 'Dell XPS', 'ThinkPad', 'iMac'][Math.floor(Math.random() * 4)],
            officeSpace: Math.random() > 0.3 ? `Desk ${Math.floor(Math.random() * 100) + 1}` : 'Remote',
            // Benefits and compensation
            vacationDays: Math.floor(Math.random() * 15) + 15,
            usedVacationDays: Math.floor(Math.random() * 10),
            healthInsurance: Math.random() > 0.1,
            retirement401k: Math.random() > 0.2,
            // Performance metrics
            goalsCompleted: Math.floor(Math.random() * 10) + 1,
            totalGoals: Math.floor(Math.random() * 5) + 10,
            lastRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            // Custom fields for filtering
            tags: ['high-performer', 'team-lead', 'new-hire', 'mentor', 'cross-functional']
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 3) + 1)
        };
    });
};

// Utility functions for the bento grid
const gridUtils = {
    // Calculate optimal card size based on content
    calculateCardSize: (item: any, viewMode: string) => {
        if (viewMode === 'compact') return 'auto';

        let size = 'medium';
        const contentScore = (item.skills?.length || 0) +
            (item.bio ? 20 : 0) +
            (item.projects || 0) * 2;

        if (contentScore > 30) size = 'large';
        else if (contentScore < 15) size = 'small';

        return size;
    },

    // Filter utilities
    createQuickFilters: (data: any[]) => {
        const departments = [...new Set(data.map(item => item.department))];
        const roles = [...new Set(data.map(item => item.role))];
        const statuses = [...new Set(data.map(item => item.status))];

        return {
            department: departments.map(d => ({ label: d, value: d })),
            role: roles.map(r => ({ label: r, value: r })),
            status: statuses.map(s => ({ label: s, value: s }))
        };
    },

    // Export utilities
    exportToCSV: (data: any[], filename = 'data.csv') => {
        const headers = Object.keys(data[0] || {});
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    },

    // Animation presets
    animationPresets: {
        cardEntry: {
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }
            }
        },
        cardHover: {
            scale: 1.02,
            y: -4,
            transition: { duration: 0.2 }
        },
        cardSelected: {
            scale: 1.03,
            boxShadow: "0 0 0 2px #ffffff, 0 8px 25px rgba(255, 255, 255, 0.15)",
            transition: { duration: 0.2 }
        }
    }
};

export { generateSampleData, gridUtils };
