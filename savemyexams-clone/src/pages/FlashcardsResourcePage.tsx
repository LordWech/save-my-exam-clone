import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import type { ResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

interface FlashcardsResourcePageProps {
  context: ResourceContext;
}

const statusCards = [
  {
    label: 'Still learning',
    emoji: '🙂',
    count: 6,
    hrefSuffix: 'still-learning',
  },
  {
    label: 'Know',
    emoji: '😎',
    count: 8,
    hrefSuffix: 'know',
  },
  {
    label: 'Revisit',
    emoji: '🧊',
    count: 4,
    hrefSuffix: 'revisit',
  },
];

const topicProgressPalette = ['bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-sky-400'];

const computeTopicStats = (topic: string, index: number) => {
  const base = topic.length + index * 7;
  const mastered = (base % 40) + 40; // 40 - 79
  const revisit = (base % 20) + 10; // 10 - 29
  const learning = Math.max(0, 100 - mastered - revisit);

  return {
    mastered,
    learning,
    revisit,
  };
};

export const FlashcardsResourcePage = ({ context }: FlashcardsResourcePageProps) => {
  const { level, subject, board } = context;
  const sections = useMemo(() => board.revisionNotes?.sections ?? [], [board]);
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.title ?? null);

  const totalCards = useMemo(() => sections.reduce((sum, section) => sum + section.topics.length * 6, 0), [sections]);
  const firstTopicSlug = sections[0]?.topics?.[0] ? slugify(sections[0].topics[0]) : null;

  const toggleSection = (title: string) => {
    setExpandedSection((current) => (current === title ? null : title));
  };

  return (
    <SiteLayout>
      <div className="space-y-12">
        <header className="space-y-6">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <Link to="/resources/browse" className="transition hover:text-white">
              Resources
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{level.name}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{subject.name}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">Flashcards</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-gradient-to-tr from-[#111f3c] via-[#13264d] to-[#0a1730] px-8 py-10 text-white shadow-lg shadow-slate-900/60">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-400">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-xl">📚</span>
                Flashcards
              </div>
              <h1 className="text-3xl font-semibold">{board.name} {subject.name}</h1>
              {board.examCode ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-200">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  Exam code: {board.examCode}
                </span>
              ) : null}
              <p className="max-w-2xl text-sm text-slate-200/80">
                Build confidence with curated flashcard decks that track progress automatically. Work through topics, review
                mastered concepts, and revisit anything that needs more practice.
              </p>
              <div className="text-xs text-slate-300/80">Total cards available: {totalCards}</div>
            </div>
            {firstTopicSlug ? (
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${firstTopicSlug}`}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Practise now →
              </Link>
            ) : (
              <a
                href="#practice"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Practise now →
              </a>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {statusCards.map((card) => {
              const cardContent = (
                <div className="flex flex-col justify-between gap-2 rounded-3xl border border-slate-800/60 bg-[#0b141f] px-6 py-5 text-sm text-slate-200 shadow-inner shadow-black/20 transition hover:border-sky-500/60 hover:shadow-sky-500/10">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="text-lg">{card.emoji}</span>
                      {card.label}
                    </span>
                    <span className="text-xs text-slate-500">{card.count} decks</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-success)]" style={{ width: `${Math.min(100, card.count * 10)}%` }} />
                  </div>
                </div>
              );

              if (card.hrefSuffix) {
                return (
                  <Link
                    key={card.label}
                    to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${card.hrefSuffix}`}
                    className="block"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div key={card.label} className="block">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </header>

        <section className="space-y-6" id="practice">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">All collections</h2>
              <p className="text-xs text-slate-400">Open a topic to jump into the flashcards matched to your syllabus.</p>
            </div>
            <button
              type="button"
              onClick={() => setExpandedSection(sections[0]?.title ?? null)}
              className="hidden rounded-full border border-slate-700/70 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-500 hover:text-white md:inline-flex"
            >
              Reset view
            </button>
          </div>

          <div className="space-y-3">
            {sections.length === 0 ? (
              <div className="rounded-2xl border border-slate-800/70 bg-[#0a131f] px-6 py-8 text-sm text-slate-300">
                Flashcard collections for this exam board are coming soon. Check back shortly.
              </div>
            ) : null}
            {sections.map((section, sectionIndex) => {
              const isOpen = expandedSection === section.title;
              return (
                <div key={section.title} className="overflow-hidden rounded-2xl border border-slate-800/70 bg-[#0a131f]">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-white transition hover:bg-slate-900/30"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700/70 text-xs text-slate-300">
                        {sectionIndex + 1}
                      </span>
                      {section.title}
                    </span>
                    <span className="text-slate-500">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen ? (
                    <div className="space-y-2 border-t border-slate-800/60 bg-[#0d1728] px-6 py-4 text-sm text-slate-200">
                      {section.topics.map((topic, topicIndex) => {
                        const stats = computeTopicStats(topic, topicIndex + sectionIndex);
                        const total = stats.learning + stats.mastered + stats.revisit;
                        const segments = [
                          { value: stats.learning, label: 'Learning', color: topicProgressPalette[0] },
                          { value: stats.mastered, label: 'Know', color: topicProgressPalette[1] },
                          { value: stats.revisit, label: 'Revisit', color: topicProgressPalette[2] },
                        ];
                        const topicSlug = slugify(topic);
                        return (
                          <div
                            key={topic}
                            className="flex flex-col gap-2 rounded-xl border border-slate-800/60 bg-[#101e35] px-4 py-3 text-xs text-slate-300 transition hover:border-sky-500/60"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">{topic}</span>
                              <Link
                                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${topicSlug}`}
                                className="text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                              >
                                Continue →
                              </Link>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                              <div className="flex h-full w-full">
                                {segments.map((segment) => (
                                  <div
                                    key={segment.label}
                                    className={`${segment.color}`}
                                    style={{ width: `${total > 0 ? (segment.value / total) * 100 : 0}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-[0.65rem] text-slate-400">
                              {segments.map((segment) => (
                                <span key={segment.label} className="flex items-center gap-2">
                                  <span className={`inline-flex h-2 w-2 rounded-full ${segment.color}`} />
                                  {segment.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
};
