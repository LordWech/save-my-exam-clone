import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';

export const NotFoundPage = () => (
  <SiteLayout>
    <div className="flex flex-col items-start gap-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="text-3xl font-semibold text-white">Page not found</h1>
        <p className="max-w-xl text-sm leading-6 text-slate-300">
          The page you tried to reach doesn&apos;t exist yet. Head back to the dashboard or use the resource explorer to find
          what you need.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
        >
          Go to dashboard
        </Link>
        <Link
          to="/resources/browse"
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
        >
          Browse resources
        </Link>
      </div>
    </div>
  </SiteLayout>
);
