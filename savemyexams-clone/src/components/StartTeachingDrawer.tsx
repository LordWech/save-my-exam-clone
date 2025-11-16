interface StartTeachingDrawerProps {
  open: boolean;
  onClose: () => void;
}

const levels = ['GCSE', 'IGCSE', 'AS', 'A Level', 'IB', 'O Level', 'AP', 'Other'];
const quickLinks = ['Learning hub', 'Glossaries', 'About us', 'Help and support'];

const CloseIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
  >
    <path
      d="M5 5l10 10M15 5L5 15"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StartTeachingDrawer = ({ open, onClose }: StartTeachingDrawerProps) => (
  <div
    className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} duration-200`}
    aria-hidden={!open}
  >
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />
    <aside
      className={`relative ml-0 flex h-full w-full max-w-md flex-col bg-[#0c111f] text-slate-200 shadow-2xl shadow-black/60 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800/60 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Start teaching</p>
          <h2 className="text-lg font-semibold text-white">Choose a pathway</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/60 text-slate-300 transition hover:border-sky-500 hover:text-white"
          aria-label="Close start teaching drawer"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Exam levels</p>
          <ul className="space-y-2 text-sm">
            {levels.map((level) => (
              <li key={level}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-transparent bg-[#121a2f] px-4 py-3 text-left font-medium text-slate-200 transition hover:border-sky-500/60 hover:text-white"
                >
                  <span>{level}</span>
                  <span className="text-slate-500">{'>'}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Quick access</p>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-slate-300 transition hover:border-sky-500/60 hover:text-white"
                >
                  <span>{item}</span>
                  <span className="text-slate-500">{'>'}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  </div>
);
