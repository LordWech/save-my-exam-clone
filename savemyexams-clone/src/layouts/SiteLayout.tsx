import type { ReactNode } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SiteLayoutProps {
  children: ReactNode;
}

export const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12)_0%,_rgba(16,20,26,0)_55%)]" />
    <Header />
  <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    <Footer />
  </div>
);
