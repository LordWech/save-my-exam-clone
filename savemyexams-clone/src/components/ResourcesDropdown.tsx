import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { resourceTypeLabels, type ResourceType } from '../data/resources';

interface ResourcesDropdownProps {
  onClose: () => void;
  onOpenExplorer: () => void;
}

const icons: Record<ResourceType, ReactNode> = {
  'revision-notes': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-sky-400">
      <path d="M6 4h8l4 4v12H6z" />
      <path d="M14 4v4h4" />
      <path d="M8 14h8M8 10h4" />
    </svg>
  ),
  'exam-questions': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-indigo-400">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r=".8" fill="currentColor" stroke="none" />
    </svg>
  ),
  'smart-mark': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-purple-400">
      <path d="M4 7h16M4 12h10M4 17h6" />
      <path d="M16 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flashcards: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-pink-400">
      <rect x="4" y="6" width="12" height="12" rx="2" />
      <rect x="9" y="3" width="11" height="14" rx="2" />
    </svg>
  ),
  'mock-exams': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-amber-400">
      <path d="M5 5h14v14H5z" />
      <path d="M8 9h8M8 13h5" />
      <path d="M8 17h8" strokeLinecap="round" />
    </svg>
  ),
  'target-test': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-emerald-400">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  'past-papers': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-cyan-400">
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M16 4v3h3" />
      <path d="M8 11h8M8 15h5" />
    </svg>
  ),
  'test-builder': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-rose-400">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h2M8 13h2M8 17h2" strokeLinecap="round" />
      <path d="M12 9h5M12 13h5M12 17h5" />
    </svg>
  ),
};

const studentResources: Array<{
  type: ResourceType;
  blurb: string;
}> = [
  { type: 'revision-notes', blurb: 'High-yield topic summaries with worked examples.' },
  { type: 'exam-questions', blurb: 'Topic-tagged question banks with solutions.' },
  { type: 'smart-mark', blurb: 'AI-assisted feedback that pinpoints misconceptions.' },
  { type: 'flashcards', blurb: 'Quick-fire recall practice that sticks.' },
  { type: 'mock-exams', blurb: 'Simulate real exam conditions with timed papers.' },
  { type: 'target-test', blurb: 'Personalised quizzes to close knowledge gaps.' },
  { type: 'past-papers', blurb: 'Every past paper, mark scheme and model answer.' },
];

const teacherResources: Array<{
  type: ResourceType;
  blurb: string;
  badge?: string;
}> = [
  { type: 'test-builder', blurb: 'Build differentiated assessments in minutes.', badge: 'New' },
];

export const ResourcesDropdown = ({ onClose, onOpenExplorer }: ResourcesDropdownProps) => (
  <div className="absolute left-1/2 top-full z-40 mt-3 w-[420px] -translate-x-1/2">
    <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-[#0c111f] shadow-2xl shadow-black/60">
      <div className="grid gap-6 px-6 py-6">
        <div className="grid gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">For students</p>
          <div className="grid gap-2">
            {studentResources.map((resource) => (
              <Link
                key={resource.type}
                to={`/resources/type/${resource.type}`}
                onClick={onClose}
                className="flex items-start gap-3 rounded-2xl border border-transparent px-4 py-3 transition hover:border-sky-500/60 hover:bg-slate-900/50"
              >
                <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/70">
                  {icons[resource.type]}
                </span>
                <span className="space-y-1 text-left">
                  <span className="block text-sm font-semibold text-white">{resourceTypeLabels[resource.type]}</span>
                  <span className="block text-xs text-slate-400">{resource.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-800/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Made for teachers</p>
          <div className="grid gap-2">
            {teacherResources.map((resource) => (
              <Link
                key={resource.type}
                to={`/resources/type/${resource.type}`}
                onClick={onClose}
                className="flex items-start gap-3 rounded-2xl border border-transparent px-4 py-3 transition hover:border-sky-500/60 hover:bg-slate-900/50"
              >
                <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/70">
                  {icons[resource.type]}
                </span>
                <span className="flex flex-1 flex-col gap-1 text-left">
                  <span className="text-sm font-semibold text-white">{resourceTypeLabels[resource.type]}</span>
                  <span className="text-xs text-slate-400">{resource.blurb}</span>
                </span>
                {resource.badge ? (
                  <span className="rounded-full border border-rose-500/50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-rose-300">
                    {resource.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenExplorer();
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-6 py-2 text-sm font-medium text-white transition hover:border-sky-400 hover:bg-sky-500/10"
        >
          Browse by subject
        </button>
      </div>
    </div>
  </div>
);
