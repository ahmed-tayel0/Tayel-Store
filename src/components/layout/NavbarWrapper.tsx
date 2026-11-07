'use client';

import { usePathname } from '@/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ReactNode } from 'react';

interface NavbarWrapperProps {
  children: ReactNode;
}

export function NavbarWrapper({ children }: NavbarWrapperProps) {
  const pathname = usePathname();

  // Hide navbar and footer on landing page (root path after locale)
  const isLandingPage = pathname === '/' || pathname === '';

  return (
    <>
      {!isLandingPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isLandingPage && <Footer />}
    </>
  );
}