import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import type { ResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

type RevisionSection = {
  id: string;
  title: string;
  slug: string;
  topics: {
    id: string;
    label: string;
    slug: string;
  }[];
};

const buildSections = (context: ResourceContext): RevisionSection[] => {
  const rawSections = context.board.revisionNotes?.sections ?? [];
  return rawSections.map((section, sectionIndex) => ({
    id: slugify(`${context.board.slug}-${section.title || sectionIndex}`),
    title: section.title || `Section ${sectionIndex + 1}`,
    slug: slugify(section.title || `section-${sectionIndex + 1}`),
    topics: section.topics.map((topic, topicIndex) => ({
      id: slugify(`${context.board.slug}-${topic}-${topicIndex}`),
      label: topic,
      slug: slugify(topic),
    })),
  }));
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const getSectionProgress = (sectionIndex: number, totalSections: number) => {
  if (totalSections <= 0) {
    return 0;
  }
  const base = 45 + ((totalSections - sectionIndex) / totalSections) * 45;
  return clampPercent(base);
};

const getTopicProgress = (sectionIndex: number, topicIndex: number, topicCount: number) => {
  if (topicCount <= 1) {
    return clampPercent(50 + sectionIndex * 5);
  }
  const ratio = (topicIndex + 1) / topicCount;
  const sectionBias = Math.max(0, 10 - sectionIndex * 1.5);
  return clampPercent(25 + ratio * 55 + sectionBias);
};

const pickProgressColour = (percent: number) => {
  if (percent >= 75) {
    return 'var(--color-success)';
  }
  if (percent >= 55) {
    return 'var(--color-accent)';
  }
  return 'var(--color-warning)';
};

const ProgressRing = ({ percent, size = 44 }: { percent: number; size?: number }) => {
  const clamped = clampPercent(percent);
  const colour = pickProgressColour(clamped);
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${colour} ${clamped}%, rgba(148, 163, 184, 0.2) ${clamped}%)`,
        }}
      />
      <span className="absolute inset-[5px] rounded-full bg-[#08101d]" />
      <span className="relative text-[11px] font-semibold text-slate-200">{Math.round(clamped)}%</span>
    </span>
  );
};

interface RevisionNotesPageProps {
  context: ResourceContext;
}

export const RevisionNotesPage = ({ context }: RevisionNotesPageProps) => {
  const sections = useMemo(() => buildSections(context), [context]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((section, index) => {
      initial[section.id] = index < 3;
    });
    return initial;
  });
  const [activeTopicId, setActiveTopicId] = useState<string | null>(() => {
    const firstSection = sections[0];
    return firstSection?.topics[0]?.id ?? null;
  });

  const activeTopic = useMemo(() => {
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
      const section = sections[sectionIndex];
      const matchIndex = section.topics.findIndex((topic) => topic.id === activeTopicId);
      if (matchIndex >= 0) {
        const match = section.topics[matchIndex];
        return {
          label: match.label,
          sectionSlug: section.slug,
          topicSlug: match.slug,
          sectionIndex,
          topicIndex: matchIndex,
          topicCount: section.topics.length,
        };
      }
    }
    return null;
  }, [activeTopicId, sections]);

  const activeTopicLink = useMemo(() => {
    if (!activeTopic) {
      return null;
    }
    return `/resources/${context.level.slug}/${context.subject.slug}/${context.board.slug}/revision-notes/${activeTopic.sectionSlug}/${activeTopic.topicSlug}`;
  }, [activeTopic, context.board.slug, context.level.slug, context.subject.slug]);

  const activeTopicProgress = useMemo(() => {
    if (!activeTopic) {
      return null;
    }
    return getTopicProgress(activeTopic.sectionIndex, activeTopic.topicIndex, activeTopic.topicCount);
  }, [activeTopic]);

  if (!sections.length) {
    return (
      <SiteLayout>
        <div className="space-y-10">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="transition hover:text-white">
              Launchpad
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{context.level.name}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{context.subject.name}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">Revision Notes</span>
          </nav>
          <section className="rounded-3xl border border-slate-800/70 bg-[#0b172a] p-10 text-center text-sm text-slate-300">
            No revision notes available yet. Please choose another resource from the sidebar.
          </section>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Launchpad
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{context.level.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{context.subject.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Revision Notes</span>
        </nav>

        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{context.board.name}</p>
              <h1 className="text-3xl font-semibold text-white">{context.board.name} {context.subject.name} Revision Notes</h1>
              {context.board.examCode ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-300">
                  Exam code: {context.board.examCode}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Download overview {'->'}
            </button>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-300">
            Structured notes aligned to the latest specification. Pick a topic to open quick guidance, suggested exam questions, and classroom tips.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section, sectionIndex) => {
                const isExpanded = expandedSections[section.id];
                const sectionProgress = getSectionProgress(sectionIndex, sections.length);
                return (
                  <div key={section.id} className="rounded-3xl border border-slate-800/70 bg-[#0c172c] p-4 text-sm text-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedSections((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }));
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-sky-500/60"
                    >
                      <span className="flex items-center gap-3">
                        <ProgressRing percent={sectionProgress} />
                        <span className="flex flex-col">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">{sectionIndex + 1}.</span>
                          <span className="text-sm font-semibold text-white">{section.title}</span>
                          <span className="text-[11px] text-slate-500">{section.topics.length} topic{section.topics.length === 1 ? '' : 's'}</span>
                        </span>
                      </span>
                      <span className="text-xs text-slate-400">{isExpanded ? 'Hide' : 'Show'}</span>
                    </button>
                    {isExpanded ? (
                      <ul className="mt-3 space-y-2">
                        {section.topics.map((topic, topicIndex) => {
                          const isActive = activeTopicId === topic.id;
                          const topicHref = `/resources/${context.level.slug}/${context.subject.slug}/${context.board.slug}/revision-notes/${section.slug}/${topic.slug}`;
                          const topicProgress = getTopicProgress(sectionIndex, topicIndex, section.topics.length);
                          return (
                            <li key={topic.id}>
                              <button
                                type="button"
                                onClick={() => setActiveTopicId(topic.id)}
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2 text-left text-sm transition ${
                                  isActive
                                    ? 'border-sky-500 bg-sky-500/15 text-white shadow-lg shadow-sky-900/40'
                                    : 'border-slate-800/70 bg-[#101c33] text-slate-200 hover:border-sky-500/60 hover:bg-[#0f1f38]'
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <ProgressRing percent={topicProgress} size={38} />
                                  <span className="flex flex-col text-left">
                                    <span className="text-sm font-semibold text-white">{topic.label}</span>
                                    <span className="text-[11px] text-slate-500">Topic {topicIndex + 1} · Revision notes</span>
                                  </span>
                                </span>
                                <span className={isActive ? 'text-sky-300' : 'text-slate-500'}>{isActive ? 'Selected' : 'Open'}</span>
                              </button>
                              <div className="mt-1 text-right text-[11px]">
                                <Link to={topicHref} className="text-sky-400 transition hover:text-sky-300">
                                  View full notes
                                </Link>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800/70 bg-[#0b162a] p-6 text-sm text-slate-200">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Selected focus</p>
              <h2 className="text-xl font-semibold text-white">{activeTopic?.label ?? 'Choose a topic'}</h2>
              {activeTopicProgress !== null ? (
                <div className="flex items-center gap-3">
                  <ProgressRing percent={activeTopicProgress} size={50} />
                  <span className="text-xs text-slate-400">Estimated mastery</span>
                </div>
              ) : null}
              <p className="text-sm text-slate-300">
                {activeTopic
                  ? `Download printable notes, exam-style questions, and flashcards for ${activeTopic.label}.`
                  : 'Pick a topic from the list to surface guided resources and quick actions.'}
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5 text-xs text-slate-300">
              <p className="font-semibold text-white">Quick actions</p>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
              >
                View exam questions
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
              >
                Add to smart mark plan
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
              >
                Share with students
              </button>
              {activeTopicLink ? (
                <Link
                  to={activeTopicLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-center font-semibold text-white transition hover:bg-sky-400"
                >
                  Open detailed notes
                </Link>
              ) : null}
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5 text-xs text-slate-300">
              <p className="font-semibold text-white">Teacher note</p>
              <p className="leading-5 text-slate-300">
                Use the revision notes alongside starter quizzes and adapt the suggested exam questions into homework or live lesson checkpoints.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </SiteLayout>
  );
};
