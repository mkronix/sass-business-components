
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import { ThemeSelector } from '@/components/ThemeSelector';

export function Header() {
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-primary-custom bg-primary-custom/95 backdrop-blur supports-[backdrop-filter]:bg-primary-custom/60">
        <div className="flex h-14 items-center px-4 lg:px-6">
          <SidebarTrigger className="text-primary-custom" />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <h1 className="text-lg font-semibold text-primary-custom">Component Library</h1>
            </div>
            <nav className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setThemeModalOpen(true)}
                className="text-primary-custom hover-primary-custom"
              >
                <Palette className="h-4 w-4" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <ThemeSelector
        open={themeModalOpen}
        onOpenChange={setThemeModalOpen}
      />
    </>
  );
}
