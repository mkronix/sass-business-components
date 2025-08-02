
# React Component Library

A modern, professional React component library built with TypeScript, Tailwind CSS, and shadcn/ui components.

## ✨ Features

- **Modern Components**: Professional-grade UI components with clean design
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Responsive Design**: All components are fully responsive across devices
- **Accessibility**: WCAG compliant components with proper ARIA support
- **Theme Support**: Light/dark theme switching with custom CSS properties
- **Interactive Demos**: Live component previews with sample data
- **Easy Integration**: Simple copy-paste component usage

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-component-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 📦 Available Components

### Data Display
- **DataTable**: Feature-rich data table with sorting, filtering, and pagination
- **DataGrid**: Advanced data grid with inline editing, column management, and export functionality

### More categories coming soon...

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality accessible components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 📝 Component Structure

Each component includes:
- **Live Preview**: Interactive demo with sample data
- **Usage Examples**: Copy-paste code snippets
- **Props Documentation**: Complete API reference
- **TypeScript Support**: Full type definitions

## 🎨 Customization

Components use CSS custom properties for theming:
- Customize colors, spacing, and typography
- Full dark/light theme support
- Responsive design tokens

## 🔧 Development

### Adding New Components

1. Create component in appropriate category folder
2. Add to `src/data/components.tsx` registry
3. Update `SubcategoryPage.tsx` component mapping
4. Components automatically appear in the UI

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── data-display/   # Data visualization components
│   └── ui/             # Base UI components (shadcn/ui)
├── pages/              # Main application pages
├── data/               # Component registry and data
└── hooks/              # Custom React hooks
```

## 📄 License

MIT License - feel free to use in your projects.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

---

Built with ❤️ for modern React development
