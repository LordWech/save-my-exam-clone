import { useMemo, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { findResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

interface SupportingNote {
  label: string;
  title: string;
  description: string;
}

interface StillLearningCard {
  id: string;
  emoji: string;
  prompt: string;
  summary: string;
  detailIntro?: string;
  bulletPoints?: string[];
  supportingNote?: SupportingNote;
  ctaLabel?: string;
  topicTitle?: string;
  extraDetails?: ReactNode;
}

interface StillLearningSection {
  id: string;
  title: string;
  cards: StillLearningCard[];
}

const createStillLearningSections = (): StillLearningSection[] => [
  {
    id: 'movement-position',
    title: 'Movement & Position',
    cards: [
      {
        id: 'distance-time-graphs',
        emoji: '🙂',
        prompt: 'How is constant speed represented on a distance-time graph?',
        summary: 'On a distance-time graph, constant speed appears as a straight line.',
        detailIntro: 'Focus on how the gradient links to speed before tackling multi-part questions.',
        bulletPoints: [
          'A steeper slope shows a greater constant speed.',
          'A shallower slope shows a lower constant speed.',
          'A flat, horizontal line shows a constant speed of zero.',
        ],
        supportingNote: {
          label: 'Revision note',
          title: 'Distance-Time Graphs',
          description: 'Review the worked examples for interpreting gradients and intercepts.',
        },
        ctaLabel: 'View card',
        topicTitle: 'Distance-Time Graphs',
      },
      {
        id: 'velocity-vs-speed',
        emoji: '🙂',
        prompt: 'What information does velocity provide that speed does not?',
        summary: 'Velocity includes both the magnitude and direction of motion, unlike speed.',
        detailIntro: 'Use vector arrows to explain changes of direction even when the speed stays constant.',
        extraDetails: (
          <p className="text-sm text-slate-300">
            Speed is a scalar quantity; velocity is a vector. Always include a direction such as 5 m s^-1 north.
          </p>
        ),
      },
      {
        id: 'gradient-equation',
        emoji: '🙂',
        prompt: 'State the equation used to find the gradient of a distance-time graph.',
        summary: 'Gradient = change in distance / change in time.',
        detailIntro: 'Quote the general gradient formula before substituting distance and time.',
        extraDetails: (
          <div className="rounded-2xl border border-slate-800/60 bg-[#0f1b32] px-4 py-4 text-sm">
            <p className="font-semibold text-white">Speed = gradient = Δy / Δx</p>
            <p className="mt-2 text-slate-300">Where:</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-400">
              <li>Δy = change in distance</li>
              <li>Δx = change in time</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'stationary-object',
        emoji: '🙂',
        prompt: 'True or False? This distance-time graph shows a stationary object.',
        summary: 'True. A horizontal line means the distance is not changing with time.',
        detailIntro: 'Link the flat gradient to zero speed and relate it to the scenario in the question.',
        extraDetails: (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/60 bg-[#101d33] px-4 py-4 text-sm text-slate-300">
              A flat, horizontal line on a distance-time graph shows the object is stationary. The distance travelled stays constant.
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-slate-800/60 bg-[#0b1528] p-4">
              <div className="relative h-32 w-40 border border-slate-700">
                <span className="absolute left-1/2 top-2 -translate-x-1/2 text-xs text-slate-500">Distance</span>
                <span className="absolute left-2 bottom-2 text-xs text-slate-500">Time</span>
                <div className="absolute bottom-4 left-10 h-24 w-0.5 bg-slate-600" />
                <div className="absolute left-10 right-4 top-16 h-0.5 bg-sky-400" />
              </div>
            </div>
          </div>
        ),
        topicTitle: 'Distance-Time Graphs',
        ctaLabel: 'Open practice set',
      },
    ],
  },
];

export const FlashcardsStillLearningPage = () => {
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

  const sections = useMemo(() => createStillLearningSections(), []);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    sections.reduce((accumulator, section) => {
      accumulator[section.id] = true;
      return accumulator;
    }, {} as Record<string, boolean>),
  );

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    sections.forEach((section) => {
      if (section.cards[0]) {
        defaults[section.cards[0].id] = true;
      }
    });
    return defaults;
  });

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
          <span className="text-slate-200">Still learning</span>
        </nav>

        <header className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b1528] p-6 text-slate-200 shadow-lg shadow-black/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-sky-500 hover:text-white"
              >
                ← Back to flashcards
              </Link>
              <h1 className="text-3xl font-semibold text-white">Still learning</h1>
              <p className="text-sm text-slate-400">
                These cards were marked for extra practice. Work through them regularly so you can move them to <span className="text-sky-400">Know</span>.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right text-xs text-slate-400">
              <span className="text-sm font-semibold text-white">6 cards to revisit</span>
              <span>Updated today • {board.name} {subject.name}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
              Focus: build fluency with core graphs and definitions
            </span>
            {board.examCode ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                Exam code: {board.examCode}
              </span>
            ) : null}
          </div>
        </header>

        <section className="space-y-5">
          {sections.map((section) => {
            const isSectionOpen = expandedSections[section.id];
            return (
              <div key={section.id} className="rounded-3xl border border-slate-800/70 bg-[#0a1323]">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-white transition hover:bg-slate-900/40"
                >
                  <span>{section.title}</span>
                  <span className="text-slate-500">{isSectionOpen ? '−' : '+'}</span>
                </button>
                {isSectionOpen ? (
                  <div className="space-y-3 border-t border-slate-800/70 px-5 py-5">
                    {section.cards.map((card) => {
                      const isCardOpen = expandedCards[card.id] ?? false;
                      const topicSlug = card.topicTitle ? slugify(card.topicTitle) : null;
                      const ctaHref = topicSlug
                        ? `/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${topicSlug}`
                        : null;
                      const hasLeftColumn = Boolean(card.supportingNote || card.detailIntro || ctaHref);
                      const hasRightColumn = Boolean((card.bulletPoints && card.bulletPoints.length > 0) || card.extraDetails);
                      const gridColumns = hasLeftColumn && hasRightColumn ? 'md:grid-cols-2' : 'md:grid-cols-1';

                      return (
                        <div key={card.id} className="rounded-2xl border border-slate-800/70 bg-[#0d172e] px-4 py-4 text-sm text-slate-200">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-3 md:max-w-2xl">
                              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-xl">{card.emoji}</span>
                              <p className="text-sm font-semibold leading-6 text-white">{card.prompt}</p>
                            </div>
                            <div className="flex w-full items-center justify-between gap-4 md:w-auto md:pl-6">
                              <p className="flex-1 text-sm text-slate-300 md:text-right">{card.summary}</p>
                              <button
                                type="button"
                                onClick={() => toggleCard(card.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-sky-500 hover:text-white"
                                aria-expanded={isCardOpen}
                                aria-controls={`${card.id}-details`}
                              >
                                {isCardOpen ? '−' : '+'}
                              </button>
                            </div>
                          </div>
                          {isCardOpen ? (
                            <div
                              id={`${card.id}-details`}
                              className={`mt-4 grid gap-6 rounded-2xl border border-slate-800/70 bg-[#101d33] px-5 py-5 ${gridColumns}`}
                            >
                              {hasLeftColumn ? (
                                <div className="space-y-4 text-sm text-slate-300">
                                  {card.supportingNote ? (
                                    <div className="space-y-2 rounded-2xl border border-slate-800/70 bg-[#0b1528] px-4 py-4">
                                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{card.supportingNote.label}</span>
                                      <p className="text-sm font-semibold text-white">{card.supportingNote.title}</p>
                                      <p className="text-xs text-slate-400">{card.supportingNote.description}</p>
                                    </div>
                                  ) : null}
                                  {card.detailIntro ? <p>{card.detailIntro}</p> : null}
                                  {ctaHref ? (
                                    <Link
                                      to={ctaHref}
                                      className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                                    >
                                      {card.ctaLabel ?? 'View card'}
                                    </Link>
                                  ) : null}
                                </div>
                              ) : null}
                              {hasRightColumn ? (
                                <div className="space-y-3 text-sm text-slate-300">
                                  {card.bulletPoints ? (
                                    <ul className="list-disc space-y-1 pl-5 text-slate-300">
                                      {card.bulletPoints.map((point) => (
                                        <li key={point}>{point}</li>
                                      ))}
                                    </ul>
                                  ) : null}
                                  {card.extraDetails}
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

        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-800/70 bg-[#0b1528] px-6 py-5 text-sm text-slate-300">
          <div>Ready to move these cards to Know? Practise the full topic deck next.</div>
          <Link
            to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards`}
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500/10"
          >
            Return to flashcards overview
          </Link>
        </footer>
      </div>
    </SiteLayout>
  );
};
