
import { ThemeSelector } from '@/components/ThemeSelector/ThemeSelector';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  return (
    <header className="h-16 border-primary-custom bg-secondary border-b border-primary-custom bg-primary-custom sticky top-0 z-30">
      <div className="flex h-full items-center justify-between px-6">
        <Link to="/">
          <h1 className="text-lg font-semibold text-primary-custom">Business SaaS Components</h1>
          <p className="text-xs text-secondary-custom">Sophisticated Component Library</p>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setThemeModalOpen(true)}
            className="w-10 h-10 rounded-xl hover:bg-transparent"
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
