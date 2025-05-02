'use client';

import {
  getActiveNavbar,
  getActiveRoute,
  isWindowAvailable,
} from 'utils/navigation';
import { useEffect, useState } from 'react';

import Navbar from 'components/navbar';
import React from 'react';
import Sidebar from 'components/sidebar';
import routes from 'routes';
import { usePathname } from 'next/navigation';

export default function Admin({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const pathname = usePathname();

  // Define direction
  if (isWindowAvailable()) document.documentElement.dir = 'ltr';

  // Detect mobile view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setShowNavbar(window.innerWidth >= 768); // md breakpoint
      };

      handleResize(); // Run on mount
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="flex h-full w-full bg-background-100 dark:bg-background-900">
      <Sidebar />
      <div className="h-full w-full font-dm dark:bg-navy-900">
          <div>
            {showNavbar && (
              <Navbar
                onOpenSidenav={() => setOpen(!open)}
                brandText={getActiveRoute(routes, pathname)}
                secondary={getActiveNavbar(routes, pathname)}
              />
            )}
            <div className="mx-auto min-h-screen p-2 pt-16 md:pt-2">
              {children}
            </div>
          </div>
      </div>
    </div>
  );
}
