import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SiteLayoutProps {
  children: ReactNode;
}

export const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div className="relative min-h-screen overflow-x-hidden bg-[#050814] text-slate-100">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18)_0%,_rgba(8,12,24,0)_50%)]" />
    <Header />
    <main className="relative mx-auto w-full max-w-6xl px-6 py-12">{children}</main>
    <Footer />
  </div>
);
