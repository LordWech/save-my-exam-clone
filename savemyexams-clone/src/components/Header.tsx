import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { StartTeachingDrawer } from './StartTeachingDrawer';
import { ResourcesDrawer } from './ResourcesDrawer';
import { ResourcesDropdown } from './ResourcesDropdown';

const ChevronDown = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 7.5l5 5 5-5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
  >
    <path
      d="M15.75 15.75L21 21"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={11}
      cy={11}
      r={6}
      stroke="currentColor"
      strokeWidth={1.5}
    />
  </svg>
);

const LightningIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
  >
    <path d="M13.5 3L6 13h5l-.5 8 7.5-10h-5z" />
  </svg>
);

const HeaderComponent = () => {
  const [teachingOpen, setTeachingOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [resourcesDrawerOpen, setResourcesDrawerOpen] = useState(false);
  const resourcesButtonRef = useRef<HTMLButtonElement | null>(null);
  const resourcesMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTeachingOpen(false);
        setResourcesDropdownOpen(false);
        setResourcesDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const shouldLock = teachingOpen || resourcesDrawerOpen;

    if (!shouldLock) {
      document.body.style.overflow = '';
      return;
    }

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previous;
    };
  }, [teachingOpen, resourcesDrawerOpen]);

  useEffect(() => {
    if (!resourcesDropdownOpen) {
      return;
    }

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (resourcesMenuRef.current?.contains(target)) {
        return;
      }
      if (resourcesButtonRef.current?.contains(target)) {
        return;
      }
      setResourcesDropdownOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
    };
  }, [resourcesDropdownOpen]);

  const toggleTeachingDrawer = () => {
    setTeachingOpen((current) => {
      const next = !current;
      if (next) {
        setResourcesDropdownOpen(false);
        setResourcesDrawerOpen(false);
      }
      return next;
    });
  };

  const toggleResourcesDropdown = () => {
    setResourcesDropdownOpen((current) => {
      const next = !current;
      if (next) {
        setTeachingOpen(false);
        setResourcesDrawerOpen(false);
      }
      return next;
    });
  };

  const openResourcesExplorer = () => {
    setTeachingOpen(false);
    setResourcesDropdownOpen(false);
    setResourcesDrawerOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-[#060b16]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-5">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/40"
              aria-label="SaveMyExams home"
            >
              <LightningIcon />
            </Link>
            <Link to="/" className="text-lg font-semibold text-white">
              SaveMyExams
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <button
              type="button"
              className="flex items-center gap-1 text-slate-300 transition hover:text-white"
              onClick={toggleTeachingDrawer}
              aria-expanded={teachingOpen}
            >
              <span>Start teaching</span>
              <ChevronDown className={teachingOpen ? 'h-4 w-4 rotate-180 transition' : 'h-4 w-4 transition'} />
            </button>
            <div className="relative">
              <button
                type="button"
                ref={resourcesButtonRef}
                className="flex items-center gap-1 text-slate-300 transition hover:text-white"
                onClick={toggleResourcesDropdown}
                aria-expanded={resourcesDropdownOpen}
              >
                <span>Resources</span>
                <ChevronDown className={resourcesDropdownOpen ? 'h-4 w-4 rotate-180 transition' : 'h-4 w-4 transition'} />
              </button>
              {resourcesDropdownOpen ? (
                <div ref={resourcesMenuRef}>
                  <ResourcesDropdown
                    onClose={() => setResourcesDropdownOpen(false)}
                    onOpenExplorer={openResourcesExplorer}
                  />
                </div>
              ) : null}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden w-80 items-center md:flex">
            <span className="pointer-events-none absolute left-4 text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Search for a subject"
              className="w-full rounded-full border border-slate-800/70 bg-[#0a1021] py-2.5 pl-12 pr-4 text-sm text-slate-100 shadow-inner shadow-black/30 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          <button
            type="button"
            className="hidden rounded-full border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white md:block"
          >
            Launch student view
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
          >
            <span>My account</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        </div>
      </header>
      <StartTeachingDrawer open={teachingOpen} onClose={() => setTeachingOpen(false)} />
      <ResourcesDrawer open={resourcesDrawerOpen} onClose={() => setResourcesDrawerOpen(false)} />
    </>
  );
};

export const Header = memo(HeaderComponent);
