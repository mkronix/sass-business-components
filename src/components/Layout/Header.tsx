
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ThemeSelector } from '@/components/ThemeSelector/ThemeSelector';
import { Link } from 'react-router-dom';

export function Header() {
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 sticky top-0 z-30">
      <div className="flex h-full items-center justify-between px-6">
        <Link to="/">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Business SaaS Components</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Sophisticated Component Library</p>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setThemeModalOpen(true)}
            className="w-10 h-10 rounded-xl"
          >
            <Palette className="h-4 w-4" />
            <span className="sr-only">Open theme customizer</span>
          </Button>
        </div>
      </div>

      <ThemeSelector 
        open={themeModalOpen} 
        onOpenChange={setThemeModalOpen} 
      />
    </header>
  );
}
