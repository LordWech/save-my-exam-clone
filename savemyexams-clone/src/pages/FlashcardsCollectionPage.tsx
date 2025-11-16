import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { findResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

interface TopicWithSlug {
  title: string;
  slug: string;
}

interface SectionWithTopics {
  title: string;
  topics: TopicWithSlug[];
}

interface GeneratedCard {
  question: string;
  answer: string;
  hint: string;
}

const buildCards = (topic: string): GeneratedCard[] => {
  const samples = [
    {
      question: `What are the standard units used to measure ${topic.toLowerCase()}?`,
      answer: `${topic} is commonly measured in SI base units; examples include metres, seconds and kilograms depending on the quantity involved.`,
      hint: 'Think about the SI base units.',
    },
    {
      question: `How would you describe ${topic.toLowerCase()} in a single sentence?`,
      answer: `${topic} can be described from first principles by considering the fundamental relationships between displacement, time and force.`,
      hint: 'Link it back to forces and motion.',
    },
    {
      question: `Name a common misconception students have about ${topic.toLowerCase()}.`,
      answer: `A frequent misconception is assuming that ${topic.toLowerCase()} remains constant without considering external factors such as resistance or changing force.`,
      hint: 'What do learners often forget to include?',
    },
    {
      question: `Give one exam-style tip for revising ${topic.toLowerCase()}.`,
      answer: `Practise drawing labelled diagrams for ${topic.toLowerCase()} and annotate them with the correct units to support full-mark answers.`,
      hint: 'Visual revision aids are powerful.',
    },
  ];

  return samples.map((item, index) => ({
    question: `${index + 1}. ${item.question}`,
    answer: item.answer,
    hint: item.hint,
  }));
};

const buildSections = (rawSections: { title: string; topics: string[] }[]): SectionWithTopics[] =>
  rawSections.map((section) => ({
    title: section.title,
    topics: section.topics.map((topic) => ({
      title: topic,
      slug: slugify(topic),
    })),
  }));

export const FlashcardsCollectionPage = () => {
  const params = useParams<{
    levelSlug: string;
    subjectSlug: string;
    boardSlug: string;
    topicSlug: string;
  }>();

  const context = params.levelSlug && params.subjectSlug && params.boardSlug
    ? findResourceContext(params.levelSlug, params.subjectSlug, params.boardSlug)
    : null;

  const sections = useMemo(
    () => (context?.board.revisionNotes ? buildSections(context.board.revisionNotes.sections) : []),
    [context],
  );

  const activeTopic = useMemo(() => {
    if (!params.topicSlug) {
      return null;
    }

    for (const section of sections) {
      const match = section.topics.find((topic) => topic.slug === params.topicSlug);
      if (match) {
        return { section, topic: match };
      }
    }

    return null;
  }, [sections, params.topicSlug]);

  const cards = useMemo(() => (activeTopic ? buildCards(activeTopic.topic.title) : []), [activeTopic]);

  const [expandedSection, setExpandedSection] = useState<string | null>(activeTopic?.section.title ?? sections[0]?.title ?? null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    setExpandedSection(activeTopic?.section.title ?? sections[0]?.title ?? null);
    setActiveCardIndex(0);
    setIsFlipped(false);
    setShowAnswers(false);
  }, [activeTopic?.section.title, sections]);

  const nextTopic = useMemo(() => {
    if (!activeTopic) {
      return null;
    }

    const flatTopics = sections.flatMap((section) => section.topics);
    const index = flatTopics.findIndex((topic) => topic.slug === activeTopic.topic.slug);
    if (index === -1 || flatTopics.length <= 1) {
      return null;
    }
    return flatTopics[(index + 1) % flatTopics.length];
  }, [activeTopic, sections]);

  if (!context || !activeTopic) {
    return <Navigate to="/not-found" replace />;
  }

  const { level, subject, board } = context;

  const activeCard = cards.length > 0 ? cards[Math.min(activeCardIndex, cards.length - 1)] : null;
  const totalCards = Math.max(cards.length, 1);
  const masteredCount = Math.min(14, totalCards);
  const progressPercentage = Math.round((masteredCount / totalCards) * 100);
  const cardPosition = cards.length > 0 ? activeCardIndex + 1 : 0;
  const cardShowsAnswer = showAnswers || isFlipped;
  const cardFaceLabel = cardShowsAnswer ? 'Back' : 'Front';
  const cardContent = activeCard
    ? cardShowsAnswer
      ? activeCard.answer
      : activeCard.question
    : 'Flashcards for this topic are coming soon.';

  const handleFlipCard = () => {
    if (!activeCard || showAnswers) {
      return;
    }
    setIsFlipped((current) => !current);
  };

  const handleAdvanceCard = () => {
    if (cards.length === 0) {
      return;
    }
    setActiveCardIndex((current) => (current + 1) % cards.length);
    setIsFlipped(false);
  };

  const handleRetreatCard = () => {
    if (cards.length === 0) {
      return;
    }
    setActiveCardIndex((current) => (current - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const handleToggleAnswers = () => {
    setShowAnswers((current) => {
      const next = !current;
      if (!next) {
        setIsFlipped(false);
      }
      return next;
    });
  };

  return (
    <SiteLayout>
      <div className="space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Launchpad
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards`}
            className="transition hover:text-white"
          >
            {board.name} {subject.name}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{activeTopic.topic.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          <aside className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0a131f] p-4 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Flashcards</span>
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}`}
                className="text-xs text-sky-400 transition hover:text-sky-300"
              >
                Back
              </Link>
            </div>
            <div className="space-y-3">
              {sections.map((section) => {
                const isExpanded = expandedSection === section.title;
                const containsActive = section.topics.some((topic) => topic.slug === activeTopic.topic.slug);
                return (
                  <div key={section.title} className="rounded-2xl border border-slate-800/70 bg-[#0d1829]">
                    <button
                      type="button"
                      onClick={() => setExpandedSection((current) => (current === section.title ? null : section.title))}
                      className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-semibold transition ${
                        containsActive ? 'text-white' : 'text-slate-300'
                      } hover:bg-slate-900/40`}
                    >
                      <span>{section.title}</span>
                      <span className="text-slate-500">{isExpanded ? '−' : '+'}</span>
                    </button>
                    {isExpanded ? (
                      <ul className="space-y-1 border-t border-slate-800/70 px-4 py-3 text-xs">
                        {section.topics.map((topic) => (
                          <li key={topic.slug}>
                            <Link
                              to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${topic.slug}`}
                              className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${
                                topic.slug === activeTopic.topic.slug
                                  ? 'bg-slate-800/60 text-white'
                                  : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                              }`}
                            >
                              <span>{topic.title}</span>
                              <span className="text-slate-500">→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="space-y-8">
            <header className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-slate-200">
                  Exam code: {board.examCode ?? '4PH1'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-slate-200">
                  Still learning
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-slate-200">
                  Know {masteredCount}/{totalCards}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-white">{activeTopic.topic.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Work through each flashcard, rate your confidence, and we&apos;ll keep track of topics that need revisiting so you stay exam ready.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 px-5 py-2 text-sm font-semibold text-white transition hover:border-sky-400 hover:bg-sky-500/10"
                >
                  Full screen
                </button>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </header>

            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-800/70 bg-[#0b1423] p-6 shadow-lg shadow-black/40">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Card {cardPosition} of {totalCards}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleAnswers}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 font-semibold transition ${
                        showAnswers
                          ? 'border-slate-700/70 bg-slate-800/60 text-white hover:border-slate-500'
                          : 'border-slate-700/70 text-slate-200 hover:border-sky-500 hover:text-white'
                      }`}
                    >
                      {showAnswers ? 'Hide answers' : 'Show answers'}
                    </button>
                    <span className="hidden text-slate-500 sm:inline">Click the card or use Flip to reveal.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFlipCard}
                  disabled={!activeCard || showAnswers}
                  className={`mt-6 w-full rounded-2xl border border-slate-800/70 bg-[#101d33] px-8 py-10 text-left text-lg text-slate-200 transition ${
                    showAnswers || !activeCard ? 'cursor-default' : 'hover:border-sky-500/70 hover:bg-[#122041]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>{cardFaceLabel}</span>
                    <span>{activeCard ? subject.name : ''}</span>
                  </div>
                  <p className="mt-6 whitespace-pre-line leading-7">{cardContent}</p>
                  {!cardShowsAnswer && activeCard?.hint ? (
                    <p className="mt-6 text-xs text-slate-500">Hint: {activeCard.hint}</p>
                  ) : null}
                  {cardShowsAnswer && activeCard?.hint ? (
                    <p className="mt-6 text-xs text-slate-500">Remember: {activeCard.hint}</p>
                  ) : null}
                </button>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetreatCard}
                      disabled={!activeCard}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        !activeCard
                          ? 'cursor-not-allowed border-slate-800/70 text-slate-500'
                          : 'border-slate-700/70 text-slate-200 hover:border-slate-500 hover:text-white'
                      }`}
                      aria-label="Previous card"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleAdvanceCard}
                      disabled={!activeCard}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        !activeCard
                          ? 'cursor-not-allowed border-slate-800/70 text-slate-500'
                          : 'border-slate-700/70 text-slate-200 hover:border-slate-500 hover:text-white'
                      }`}
                      aria-label="Next card"
                    >
                      Next →
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <button
                      type="button"
                      onClick={handleFlipCard}
                      disabled={!activeCard || showAnswers}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                        showAnswers || !activeCard
                          ? 'cursor-not-allowed border-slate-800/70 text-slate-500'
                          : 'border-slate-700/70 text-slate-200 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      Flip card
                    </button>
                    <div className="flex items-center gap-2">
                      {['🤔', '🙂', '😎'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={handleAdvanceCard}
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-lg transition ${
                            emoji === '😎'
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              : emoji === '🙂'
                                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                          }`}
                          aria-label={emoji === '😎' ? 'Know it' : emoji === '🙂' ? 'Revisit soon' : 'Still learning'}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <Link to="#" className="text-sky-400 transition hover:text-sky-300">
                    Stuck? Help with this card
                  </Link>
                  {nextTopic ? (
                    <span className="text-slate-500">
                      Next:{' '}
                      <Link
                        to={`/resources/${level.slug}/${subject.slug}/${board.slug}/flashcards/${nextTopic.slug}`}
                        className="text-sky-400 transition hover:text-sky-300"
                      >
                        {nextTopic.title}
                      </Link>
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Cards in this collection ({cards.length})</h2>
                  <button
                    type="button"
                    onClick={handleToggleAnswers}
                    className="inline-flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"
                  >
                    {showAnswers ? 'Hide all answers' : 'Show all answers'}
                  </button>
                </div>
                <div className="space-y-2 rounded-3xl border border-slate-800/70 bg-[#0c1526] p-4 text-sm text-slate-200">
                  {cards.map((card) => (
                    <div key={card.question} className="rounded-2xl border border-slate-800/70 bg-[#101f33] px-4 py-3">
                      <p className="font-semibold text-white">{card.question}</p>
                      {showAnswers ? (
                        <p className="mt-2 text-xs text-slate-400">{card.answer}</p>
                      ) : (
                        <p className="mt-2 text-xs italic text-slate-500">Answer hidden. Enable “Show answers” to reveal.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};
