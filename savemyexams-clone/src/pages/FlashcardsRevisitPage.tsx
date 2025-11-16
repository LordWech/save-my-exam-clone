import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { findResourceContext } from '../data/resources';

interface RevisitCard {
  id: string;
  emoji: string;
  question: string;
  answer: string;
  promptTip: string;
  revisitReason: string;
  revisitAction: string;
  exampleFocus?: string;
}

interface RevisitSection {
  id: string;
  title: string;
  cards: RevisitCard[];
}

const buildRevisitSections = (): RevisitSection[] => [
  {
    id: 'movement-position',
    title: 'Movement & Position',
    cards: [
      {
        id: 'speed-vs-velocity-revisit',
        emoji: '🧊',
        question: 'What is the difference between speed and velocity?',
        answer: 'Speed is a scalar quantity; velocity is a vector because it includes direction.',
        promptTip: 'Underline the key word vector in your answer and include a direction to secure full marks.',
        revisitReason: 'Lost one mark for missing the direction in a recent mock exam question.',
        revisitAction: 'Practise converting between descriptions such as “5 m s⁻¹ north” and “5 m s⁻¹ at 0°”.',
      },
      {
        id: 'slowest-speed-revisit',
        emoji: '🧊',
        question: 'Which line on the distance–time graph shows the slowest speed?',
        answer: 'The line with the smallest gradient (the shallowest line).',
        promptTip: 'Make a quick note that “shallowest gradient = slowest speed” next to graph questions.',
        revisitReason: 'Mixed up the steepest and shallowest lines in timed practice.',
        revisitAction: 'Compare gradients by drawing right-angled triangles and calculating rise/run.',
      },
      {
        id: 'average-speed-revisit',
        emoji: '🧊',
        question: 'State the equation for calculating average speed.',
        answer: 'Average speed = distance moved ÷ time taken.',
        promptTip: 'Write the equation triangle (distance at the top) to keep the relationship fresh.',
        revisitReason: 'Forgot to divide by total time in a multi-step calculation.',
        revisitAction: 'Recalculate average speed for journeys with multiple stages to reinforce the process.',
      },
      {
        id: 'changing-speed-revisit',
        emoji: '🧊',
        question: 'How is changing speed represented on a distance–time graph?',
        answer: 'By a curved line. A curve indicates the gradient is changing.',
        promptTip: 'Highlight that a straight line means constant speed; any curve means acceleration or deceleration.',
        revisitReason: 'Mistakenly described a curved section as constant speed in an exam-style question.',
        revisitAction: 'Sketch how the gradient changes across the curve and label the increasing speed.',
      },
      {
        id: 'describe-motion-revisit',
        emoji: '🧊',
        question: 'Describe the motion of the object shown in this distance–time graph.',
        answer: 'The object is speeding up: each equal time interval covers a larger distance.',
        promptTip: 'Describe the slope: “the gradient is increasing, so speed increases.”',
        revisitReason: 'Answer lacked clear reference to the increasing gradient when describing motion.',
        revisitAction: 'Practise sequencing answers: start with trend, mention gradient, explain physical meaning.',
      },
    ],
  },
];

export const FlashcardsRevisitPage = () => {
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
  const sections = useMemo(() => buildRevisitSections(), []);

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
          <span className="text-slate-200">Revisit</span>
        </nav>

        <header className="space-y-4 rounded-3xl border border-amber-600/60 bg-[#211608] p-6 text-slate-200 shadow-lg shadow-black/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards`}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-amber-400 hover:text-white"
              >
                ← Back to flashcards
              </Link>
              <h1 className="text-3xl font-semibold text-white">Revisit</h1>
              <p className="text-sm text-amber-200/80">
                Target the cards that slipped recently. Strengthen your understanding before the next assessment.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right text-xs text-amber-200/80">
              <span className="text-sm font-semibold text-white">4 cards flagged</span>
              <span>Last updated today • {board.name} {subject.name}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-3 py-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
              Priority: rebuild accuracy with graphs and key definitions
            </span>
            {board.examCode ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-3 py-1">
                Exam code: {board.examCode}
              </span>
            ) : null}
          </div>
        </header>

        <section className="space-y-5">
          {sections.map((section) => {
            const isSectionOpen = expandedSections[section.id];
            return (
              <div key={section.id} className="rounded-3xl border border-amber-600/60 bg-[#1a1207]">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-white transition hover:bg-amber-900/20"
                >
                  <span>{section.title}</span>
                  <span className="text-amber-300">{isSectionOpen ? '−' : '+'}</span>
                </button>
                {isSectionOpen ? (
                  <div className="space-y-3 border-t border-amber-600/60 px-5 py-5">
                    {section.cards.map((card) => {
                      const isCardOpen = expandedCards[card.id] ?? false;
                      return (
                        <div
                          key={card.id}
                          className="rounded-2xl border border-amber-600/60 bg-[#20160b] px-4 py-4 text-sm text-amber-100 shadow-inner shadow-amber-900/20"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-3 md:max-w-2xl">
                              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-xl">
                                {card.emoji}
                              </span>
                              <div>
                                <p className="text-sm font-semibold leading-6 text-white">{card.question}</p>
                                <p className="mt-1 text-xs text-amber-200/90">{card.answer}</p>
                              </div>
                            </div>
                            <div className="flex w-full items-center justify-between gap-4 md:w-auto md:pl-6">
                              <p className="flex-1 text-sm text-amber-100/90 md:text-right">{card.promptTip}</p>
                              <button
                                type="button"
                                onClick={() => toggleCard(card.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/60 text-lg text-amber-200 transition hover:border-amber-300 hover:text-white"
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
                              className="mt-4 space-y-3 rounded-2xl border border-amber-600/60 bg-[#241a0d] px-5 py-5 text-sm text-amber-100"
                            >
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Why it&apos;s here</span>
                                <p className="mt-1 text-sm text-amber-100/90">{card.revisitReason}</p>
                              </div>
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Focus suggestion</span>
                                <p className="mt-1 text-sm text-amber-100/90">{card.revisitAction}</p>
                              </div>
                              {card.exampleFocus ? (
                                <div>
                                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Example to revisit</span>
                                  <p className="mt-1 text-sm text-amber-100/90">{card.exampleFocus}</p>
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

        <footer className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-amber-600/60 bg-[#211608] px-6 py-5 text-sm text-amber-100">
          <div>Ready to promote a card? Set a timer and re-test the tricky ones after your next study block.</div>
          <Link
            to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/know`}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/60 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-500/10"
          >
            Review mastered cards
          </Link>
        </footer>
      </div>
    </SiteLayout>
  );
};
