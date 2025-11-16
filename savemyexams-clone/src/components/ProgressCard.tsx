interface ProgressCardProps {
  courseLabel: string;
  moduleLabel: string;
  topic: string;
}

const ArrowIcon = ({ className = 'h-3.5 w-3.5' }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.5 14.5l9-9m0 0h-6m6 0v6"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const KebabIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
  >
    <path
      d="M6 10h.01M10 10h.01M14 10h.01"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProgressCard = ({ courseLabel, moduleLabel, topic }: ProgressCardProps) => (
  <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-r from-[#111b2f] via-[#10172b] to-[#0c142a] p-6 shadow-2xl shadow-black/40 ring-1 ring-white/5 sm:p-8">
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/20 text-sm font-semibold text-sky-100 ring-1 ring-sky-400/30">
          PX
        </div>
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{courseLabel}</p>
          <h2 className="text-xl font-semibold text-white">{moduleLabel}</h2>
          <p className="text-sm text-slate-300">{topic}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 self-end text-sm md:flex-row md:items-center md:gap-4 md:self-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-5 py-2 font-medium text-sky-100 transition hover:border-sky-400 hover:text-white"
        >
          <span>Revision Notes</span>
          <ArrowIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-slate-400 transition hover:border-sky-500 hover:text-white"
          aria-label="More options"
        >
          <KebabIcon />
        </button>
      </div>
    </div>
  </div>
);
