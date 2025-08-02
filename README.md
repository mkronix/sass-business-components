
# Personal Component Library

A modern, accessible React component library built with TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Accessible**: Built with accessibility in mind using Radix UI primitives
- **Responsive**: Mobile-first design with responsive components
- **Type Safe**: Full TypeScript support with proper type definitions
- **Theme Support**: Light/dark mode with custom theme system
- **Component Categories**: Organized components by functionality

## 📦 Available Components

### Data Display
- **DataTable**: Advanced data table with sorting, filtering, and pagination
- **DataGrid**: Feature-rich grid component with virtual scrolling, column management, and inline editing

### UI Components
- Complete set of UI components from shadcn/ui
- Custom components built on top of Radix UI primitives

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Primitives**: Radix UI
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 16+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd component-library

# Install dependencies
bun install
# or
npm install

# Start development server
bun dev
# or
npm run dev
```

The application will be available at `http://localhost:8080`.

### Building for Production

```bash
# Build the project
bun run build
# or
npm run build

# Preview the build
bun run preview
# or
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── data-display/     # Data display components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── Layout/          # Layout components
│   └── providers/       # Context providers
├── data/               # Static data and configurations
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── styles/             # Global styles and CSS
```

## 🎨 Theming

The project uses a custom theme system with CSS variables for colors. Themes can be switched between light and dark modes.

### Custom Colors
All colors are defined as HSL values in the CSS custom properties for better theming support.

## 📖 Usage

### Adding New Components

1. Create component in appropriate category folder under `src/components/`
2. Add component export to the category's `index.ts`
3. Register component in `src/data/components.tsx`
4. The component will automatically appear in the UI

### Component Registration

Components are registered in the `components.tsx` file with metadata:

```typescript
{
  id: 'component-id',
  name: 'Component Name',
  title: 'Display Title',
  description: 'Component description',
  status: 'ready' | 'beta' | 'alpha',
  url: '/category/subcategory/component-id'
}
```

## 🤝 Development Guidelines

- Follow TypeScript strict mode
- Use Tailwind CSS for styling (avoid inline styles)
- Implement proper accessibility features
- Maintain responsive design
- Write clear component interfaces
- Use semantic HTML elements

## 📝 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `lint` - Run ESLint
- `type-check` - Run TypeScript type checking

## 🔧 Configuration

- **Vite**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.ts`
- **ESLint**: `eslint.config.js`

## 📄 License

This is a personal project for internal use.
