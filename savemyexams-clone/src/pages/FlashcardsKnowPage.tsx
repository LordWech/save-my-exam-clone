import { useMemo, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { findResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

interface KnowCardContent {
  id: string;
  emoji: string;
  question: string;
  answer: string;
  summary?: string;
  extraContent?: ReactNode;
  topicSlug?: string;
}

interface KnowSection {
  id: string;
  title: string;
  cards: KnowCardContent[];
}

const buildKnowSections = (): KnowSection[] => [
  {
    id: 'movement-position',
    title: 'Movement & Position',
    cards: [
      {
        id: 'speed-vs-velocity',
        emoji: '😎',
        question: 'What is the difference between speed and velocity?',
        answer: 'Speed is a scalar quantity; velocity is a vector because it includes direction.',
        summary: 'Always quote a direction when describing velocity to secure full marks.',
        topicSlug: 'distance-time-graphs',
      },
      {
        id: 'slowest-speed',
        emoji: '😎',
        question: 'Which line on the distance–time graph shows the slowest speed?',
        answer: 'The line with the shallowest gradient (the orange line) represents the slowest speed.',
        topicSlug: 'distance-time-graphs',
        extraContent: (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-2xl border border-slate-700/70 bg-[#0c1526] p-4">
              <div className="relative h-40 w-48 border border-slate-600">
                <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[0.6rem] text-slate-500">DISTANCE</span>
                <span className="absolute left-2 bottom-2 text-[0.6rem] text-slate-500">TIME</span>
                <svg viewBox="0 0 120 120" className="absolute inset-4">
                  <line x1="4" y1="112" x2="100" y2="16" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="4" y1="112" x2="110" y2="28" stroke="#ffffff" strokeWidth="2" />
                  <line x1="4" y1="112" x2="110" y2="54" stroke="#fbbf24" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-slate-700/70 bg-[#0c1526] p-4">
              <div className="relative h-40 w-48 border border-slate-600">
                <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[0.6rem] text-slate-500">DISTANCE</span>
                <span className="absolute left-2 bottom-2 text-[0.6rem] text-slate-500">TIME</span>
                <svg viewBox="0 0 120 120" className="absolute inset-4">
                  <line x1="4" y1="112" x2="108" y2="20" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="4" y1="112" x2="108" y2="44" stroke="#fbbf24" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'average-speed',
        emoji: '😎',
        question: 'State the equation for calculating average speed.',
        answer: 'Average speed = distance moved ÷ time taken.',
        summary: 'Check units are consistent before substituting values.',
        topicSlug: 'distance-time-graphs',
      },
      {
        id: 'changing-speed',
        emoji: '😎',
        question: 'How is changing speed represented on a distance–time graph?',
        answer: 'A curved line indicates changing speed on a distance–time graph.',
        topicSlug: 'distance-time-graphs',
        extraContent: (
          <div className="rounded-2xl border border-slate-700/70 bg-[#0c1526] p-4 text-sm text-slate-300">
            A positive curvature shows the object is accelerating; a negative curvature shows it is slowing down.
          </div>
        ),
      },
      {
        id: 'describe-motion',
        emoji: '😎',
        question: 'Describe the motion of the object shown in this distance–time graph.',
        answer: 'The object is accelerating: the distance travelled in equal time intervals increases, so the line curves upward.',
        topicSlug: 'distance-time-graphs',
        extraContent: (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-2xl border border-slate-700/70 bg-[#0c1526] p-4">
              <div className="relative h-40 w-48 border border-slate-600">
                <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[0.6rem] text-slate-500">DISTANCE</span>
                <span className="absolute left-2 bottom-2 text-[0.6rem] text-slate-500">TIME</span>
                <svg viewBox="0 0 120 120" className="absolute inset-4 text-sky-400">
                  <path d="M6 110 C 40 80 80 40 110 16" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-[#0c1526] p-4 text-sm text-slate-300">
              Start by describing the initial slope, then explain how the gradient increases indicating acceleration.
            </div>
          </div>
        ),
      },
    ],
  },
];

export const FlashcardsKnowPage = () => {
  const params = useParams<{
    levelSlug: string;
    subjectSlug: string;
    boardSlug: string;
  }>();

  const context = useMemo(() => {
    if (!params.levelSlug || !params.subjectSlug || !params.boardSlug) {
      return null;
    }

    return findResourceContext(params.levelSlug, params.subjectSlug, params.boardSlug);
  }, [params.levelSlug, params.subjectSlug, params.boardSlug]);

  if (!context) {
    return <Navigate to="/not-found" replace />;
  }

  const { level, subject, board } = context;
  const sections = useMemo(() => buildKnowSections(), []);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    sections.reduce((accumulator, section) => {
      accumulator[section.id] = true;
      return accumulator;
    }, {} as Record<string, boolean>),
  );

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  const toggleCard = (cardId: string) => {
    setExpandedCards((current) => ({
      ...current,
      [cardId]: !current[cardId],
    }));
  };

  return (
    <SiteLayout>
      <div className="space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards`} className="transition hover:text-white">
            Flashcards
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Know</span>
        </nav>

        <header className="space-y-4 rounded-3xl border border-emerald-700/60 bg-[#0b1e19] p-6 text-slate-200 shadow-lg shadow-black/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-white"
              >
                ← Back to flashcards
              </Link>
              <h1 className="text-3xl font-semibold text-white">Know</h1>
              <p className="text-sm text-slate-300">
                These cards are in your mastered list. Review them occasionally to keep concepts sharp and exam ready.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-400">
              <span className="text-sm font-semibold text-white">8 cards mastered</span>
              <span>Last reviewed today • {board.name} {subject.name}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/70 px-3 py-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Strength: graph interpretation & key definitions
            </span>
            {board.examCode ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/70 px-3 py-1">
                Exam code: {board.examCode}
              </span>
            ) : null}
          </div>
        </header>

        <section className="space-y-5">
          {sections.map((section) => {
            const isSectionOpen = expandedSections[section.id];
            return (
              <div key={section.id} className="rounded-3xl border border-emerald-700/60 bg-[#091e18]">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-white transition hover:bg-emerald-900/30"
                >
                  <span>{section.title}</span>
                  <span className="text-emerald-400">{isSectionOpen ? '−' : '+'}</span>
                </button>
                {isSectionOpen ? (
                  <div className="space-y-3 border-t border-emerald-700/60 px-5 py-5">
                    {section.cards.map((card) => {
                      const isCardOpen = expandedCards[card.id] ?? false;
                      const topicSlug = card.topicSlug ?? slugify(section.title);

                      return (
                        <div
                          key={card.id}
                          className="rounded-2xl border border-emerald-700/60 bg-[#0f2a24] px-4 py-4 text-sm text-slate-200 shadow-inner shadow-emerald-900/20"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-3 md:max-w-2xl">
                              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-xl">
                                {card.emoji}
                              </span>
                              <div>
                                <p className="text-sm font-semibold leading-6 text-white">{card.question}</p>
                                {card.summary ? <p className="mt-1 text-xs text-emerald-300/80">{card.summary}</p> : null}
                              </div>
                            </div>
                            <div className="flex w-full items-center justify-between gap-4 md:w-auto md:pl-6">
                              <p className="flex-1 text-sm text-emerald-100 md:text-right">{card.answer}</p>
                              <button
                                type="button"
                                onClick={() => toggleCard(card.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-700/60 text-lg text-emerald-200 transition hover:border-emerald-400 hover:text-white"
                                aria-expanded={isCardOpen}
                                aria-controls={`${card.id}-details`}
                              >
                                {isCardOpen ? '−' : '+'}
                              </button>
                            </div>
                          </div>
                          {isCardOpen && (card.extraContent || card.summary || topicSlug) ? (
                            <div
                              id={`${card.id}-details`}
                              className="mt-4 rounded-2xl border border-emerald-700/60 bg-[#12352e] px-5 py-5 text-sm text-slate-200"
                            >
                              {card.extraContent ?? null}
                              {card.extraContent && card.summary ? <div className="mt-4 text-xs text-emerald-200/80">{card.summary}</div> : null}
                              {!card.extraContent && card.summary ? <div>{card.summary}</div> : null}
                              {topicSlug ? (
                                <div className="mt-4">
                                  <Link
                                    to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${topicSlug}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/70 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500/10"
                                  >
                                    Jump to topic deck
                                  </Link>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-emerald-700/60 bg-[#0b1e19] px-6 py-5 text-sm text-emerald-200">
          <div>Keep your streak alive by revisiting at least one mastered deck each session.</div>
          <Link
            to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/still-learning`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/70 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500/10"
          >
            Focus on still learning cards
          </Link>
        </footer>
      </div>
    </SiteLayout>
  );
};
