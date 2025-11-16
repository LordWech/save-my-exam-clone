import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  buildResourcePath,
  resourceCatalog,
  resourceTypeLabels,
  type LevelCatalog,
  type SubjectCatalog,
} from '../data/resources';

interface ResourcesDrawerProps {
  open: boolean;
  onClose: () => void;
}

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

const BackIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
  >
    <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ResourcesDrawer = ({ open, onClose }: ResourcesDrawerProps) => {
  const [activeLevelSlug, setActiveLevelSlug] = useState<string | null>(null);
  const [activeSubjectSlug, setActiveSubjectSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setActiveLevelSlug(null);
      setActiveSubjectSlug(null);
    }
  }, [open]);

  const levels = useMemo<LevelCatalog[]>(() => resourceCatalog, []);

  const currentLevel = useMemo(
    () => levels.find((level) => level.slug === activeLevelSlug) ?? null,
    [levels, activeLevelSlug],
  );

  useEffect(() => {
    if (!currentLevel) {
      return;
    }

    if (!activeSubjectSlug || !currentLevel.subjects.some((subject) => subject.slug === activeSubjectSlug)) {
      setActiveSubjectSlug(currentLevel.subjects[0]?.slug ?? null);
    }
  }, [currentLevel, activeSubjectSlug]);

  const selectedSubject = useMemo(() => {
    if (!currentLevel) {
      return null;
    }

    return currentLevel.subjects.find((subject) => subject.slug === activeSubjectSlug) ?? null;
  }, [currentLevel, activeSubjectSlug]);

  const showLevelPicker = !currentLevel;

  const popularSubjects = useMemo<SubjectCatalog[]>(() => {
    if (!currentLevel) {
      return [];
    }

    return currentLevel.popularSubjects
      .map((subjectSlug) => currentLevel.subjects.find((subject) => subject.slug === subjectSlug))
      .filter((subject): subject is NonNullable<typeof subject> => Boolean(subject));
  }, [currentLevel]);

  const alphabeticalSubjects = useMemo<SubjectCatalog[]>(() => {
    if (!currentLevel) {
      return [];
    }

    return [...currentLevel.subjects].sort((a, b) => a.name.localeCompare(b.name));
  }, [currentLevel]);

  const handleResourceClick = () => {
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} duration-200`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside
        className={`relative mx-auto flex h-full w-full max-w-5xl flex-col bg-[#0c111f] text-slate-200 shadow-2xl shadow-black/60 transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-6'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-800/60 px-6 py-5">
          <div className="flex items-center gap-3">
            {showLevelPicker ? null : (
              <button
                type="button"
                onClick={() => setActiveLevelSlug(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/60 text-slate-300 transition hover:border-sky-500 hover:text-white"
                aria-label="Back to level chooser"
              >
                <BackIcon />
              </button>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</p>
              <h2 className="text-lg font-semibold text-white">
                {showLevelPicker ? 'Choose a level' : `${currentLevel?.name ?? ''} subjects`}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/60 text-slate-300 transition hover:border-sky-500 hover:text-white"
            aria-label="Close resources drawer"
          >
            <CloseIcon />
          </button>
        </div>

        {showLevelPicker ? (
          <div className="grid flex-1 place-content-center gap-4 bg-[#0f172a] px-6 py-12">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {levels.map((level) => (
                <button
                  key={level.slug}
                  type="button"
                  onClick={() => {
                    setActiveLevelSlug(level.slug);
                    setActiveSubjectSlug(null);
                  }}
                  className="rounded-2xl border border-slate-800/60 bg-[#121a2f] px-6 py-5 text-left text-sm font-semibold text-slate-200 transition hover:border-sky-500/60 hover:text-white"
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 gap-6 overflow-hidden">
            <div className="hidden w-64 flex-none border-r border-slate-800/60 bg-[#0a1328] px-6 py-8 text-sm text-slate-300 md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">All subjects</p>
              <div className="mt-6 space-y-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Most popular</p>
                  <ul className="space-y-1">
                    {popularSubjects.map((subject) => (
                      <li key={subject.slug}>
                        <button
                          type="button"
                          onClick={() => setActiveSubjectSlug(subject.slug)}
                          className={`w-full rounded-lg px-3 py-2 text-left transition ${
                            subject.slug === activeSubjectSlug
                              ? 'bg-slate-800/60 text-white'
                              : 'hover:bg-slate-800/40 hover:text-white'
                          }`}
                        >
                          {subject.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">A-Z</p>
                  <ul className="space-y-1">
                    {alphabeticalSubjects.map((subject) => (
                      <li key={subject.slug}>
                        <button
                          type="button"
                          onClick={() => setActiveSubjectSlug(subject.slug)}
                          className={`w-full rounded-lg px-3 py-2 text-left transition ${
                            subject.slug === activeSubjectSlug
                              ? 'bg-slate-800/60 text-white'
                              : 'hover:bg-slate-800/40 hover:text-white'
                          }`}
                        >
                          {subject.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {selectedSubject ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {currentLevel?.name ?? ''}
                      </p>
                      <h3 className="text-xl font-semibold text-white">{selectedSubject.name}</h3>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {selectedSubject.examBoards.map((board) => (
                      <div
                        key={board.slug}
                        className="rounded-2xl border border-slate-800/60 bg-[#111b33] px-5 py-5 text-sm text-slate-300"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-white">{board.name}</p>
                            {board.examCode ? (
                              <span className="text-xs text-slate-500">Exam code: {board.examCode}</span>
                            ) : null}
                          </div>
                          {board.meta ? (
                            <span className="rounded-full border border-slate-700/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.25em] text-slate-400">
                              {board.meta}
                            </span>
                          ) : null}
                        </div>
                        <ul className="mt-4 space-y-2">
                          {board.resources.map((resourceType) => (
                            <li key={resourceType}>
                              <Link
                                to={buildResourcePath(
                                  currentLevel?.slug ?? '',
                                  selectedSubject.slug,
                                  board.slug,
                                  resourceType,
                                )}
                                onClick={handleResourceClick}
                                className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-slate-300 transition hover:border-sky-500/60 hover:text-white"
                              >
                                <span>{resourceTypeLabels[resourceType]}</span>
                                <span className="text-slate-500">{'>'}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Select a subject to view available resources.
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
