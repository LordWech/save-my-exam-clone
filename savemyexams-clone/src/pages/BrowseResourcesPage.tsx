import { useState } from 'react';
import { SiteLayout } from '../layouts/SiteLayout';
import { ResourcesDrawer } from '../components/ResourcesDrawer';

export const BrowseResourcesPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <SiteLayout>
      <div className="space-y-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</p>
          <h1 className="text-3xl font-semibold text-white">Browse resources by subject</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            Use the explorer to choose your level, subject and exam board. We&apos;ll surface every resource available for your
            selection.
          </p>
        </header>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 px-6 py-2.5 text-sm font-medium text-white transition hover:border-sky-400 hover:bg-sky-500/10"
        >
          Open resource explorer
        </button>
      </div>
      <ResourcesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SiteLayout>
  );
};
