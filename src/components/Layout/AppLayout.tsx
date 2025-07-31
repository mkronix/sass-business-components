import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { useState } from 'react';

export function AppLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-primary-custom relative">
        <AppSidebar onExpandedChange={setIsSidebarExpanded} />

        {/* Main content container */}
        <div className="flex-1 flex flex-col relative">
          {/* Blur overlay */}
          <div
            className={`
              fixed inset-0 z-30 backdrop-blur-sm bg-black/10 
              transition-all duration-300 ease-in-out
              ${isSidebarExpanded
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
              }
            `}
            onClick={() => {
              // Optional: close sidebar when clicking on overlay
              // You might need to pass a callback from sidebar to handle this
            }}
          />

          {/* Content that gets blurred */}
          <div
            className={`
              flex flex-col flex-1 relative z-10
              transition-all duration-300 ease-in-out
              ${isSidebarExpanded ? 'blur-[2px]' : 'blur-0'}
            `}
          >
            <Header />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}