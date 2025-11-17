import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import type { ResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

type ModalStage = 'topics' | 'settings' | 'attempt' | 'reviewIntro' | 'marking' | 'results';

type QuestionTypeOptionId = 'mcq' | 'structured' | 'calculation' | 'mixed';
type DifficultyOptionId = 'easy' | 'medium' | 'hard';

type ManualMarkSlide = {
  id: string;
  type: 'manual-mark';
  title: string;
  questionContext: string;
  prompt: string;
  maxMarks: number;
  studentAnswer: string;
  focusPoints: string[];
  markScheme: string[];
};

type CoachingSlide = {
  id: string;
  type: 'coaching';
  title: string;
  summary: string;
  bullets: string[];
};

type AutoFeedbackVerdict = 'positive' | 'caution' | 'urgent';

type AutoFeedbackSlide = {
  id: string;
  type: 'auto-feedback';
  title: string;
  verdict: AutoFeedbackVerdict;
  summary: string;
  bullets: string[];
};

type ReviewSlide = ManualMarkSlide | CoachingSlide | AutoFeedbackSlide;

type ResultBreakdownRow = {
  question: string;
  marks: string;
  tone: AutoFeedbackVerdict;
};

interface TopicSection {
  id: string;
  title: string;
  topics: {
    id: string;
    title: string;
  }[];
}

interface ResultsSummary {
  achieved: number;
  total: number;
  createdOn: string;
  weaker: {
    title: string;
    description: string;
    topics: string[];
  };
  stronger: {
    title: string;
    description: string;
    topics: string[];
  };
  breakdown: ResultBreakdownRow[];
}

const questionTypeOptions: Array<{
  id: QuestionTypeOptionId;
  label: string;
  helper: string;
}> = [
  { id: 'mcq', label: 'Quick-fire MCQs', helper: 'Fast checks for recall and misconceptions.' },
  { id: 'structured', label: 'Structured exam questions', helper: 'Multi-part questions that mirror past papers.' },
  { id: 'calculation', label: 'Calculations & data response', helper: 'Numerical problems with data tables and graphs.' },
  { id: 'mixed', label: 'Mixed bag', helper: 'Blend in real-world context questions and reasoning prompts.' },
];

const difficultyOptions: Array<{
  id: DifficultyOptionId;
  label: string;
  helper: string;
}> = [
  { id: 'easy', label: 'Confidence builders', helper: 'Starters and foundation-level checks.' },
  { id: 'medium', label: 'Core exam practice', helper: 'Specification-aligned mid-tier questions.' },
  { id: 'hard', label: 'Challenge zone', helper: 'Stretch and extension problems for mastery.' },
];

const buildTopicSections = (context: ResourceContext): TopicSection[] => {
  const { subject, board } = context;
  const sections = board.revisionNotes?.sections ?? [];
  if (!sections.length) {
    return [];
  }
  return sections.map((section, index) => ({
    id: slugify(`${subject.slug}-${section.title || index}`),
    title: section.title ?? `Section ${index + 1}`,
    topics: section.topics.map((topicTitle) => ({
      id: slugify(`${subject.slug}-${topicTitle}`),
      title: topicTitle,
    })),
  }));
};

const buildReviewSlides = (subjectName: string): ReviewSlide[] => [
  {
    id: 'slide-q1',
    type: 'manual-mark',
    title: 'Question 1 · Core definitions',
    questionContext: 'MCQ · 4 marks',
    prompt: 'Award up to 4 marks in total. Pay attention to scientific wording.',
    maxMarks: 4,
    studentAnswer:
      '1. A force applied to an object causing displacement in the same direction.\n2. Conservation of energy means energy cannot be created or destroyed, only transferred.\n3. Efficiency is the ratio of useful output energy to total input energy.\n4. Power is the rate of doing work.',
    focusPoints: ['Accurate keywords used in definitions.', 'Common misconceptions flagged.', 'Guide students on alternative vocabulary.'],
    markScheme: [
      'Work done: force × displacement in the direction of the force.',
      'Energy conservation: total energy in a closed system remains constant.',
      'Efficiency: useful energy (or power) output / total energy (or power) input.',
      'Power: rate of doing work or energy transferred per unit time.',
    ],
  },
  {
    id: 'slide-q2',
    type: 'manual-mark',
    title: 'Question 2 · Energy transfer in transformers',
    questionContext: 'Structured · 6 marks',
    prompt: 'Award up to 6 marks. Focus on linking turns ratio, efficiency, and core losses.',
    maxMarks: 6,
    studentAnswer:
      'An ideal transformer is assumed to have no energy losses, so \nP_primary = P_secondary. The voltage ratio equals the turns ratio. \nIf the current doubles, power increases, so efficiency decreases unless core losses are reduced. The laminated core reduces eddy currents.',
    focusPoints: [
      'Correct relationship between primary and secondary coils.',
      'Discusses causes of energy loss and how to mitigate.',
      'Clear conclusion linking efficiency with design choices.',
    ],
    markScheme: [
      'Vp / Vs = Np / Ns stated with correct symbols.',
      'Power conservation in ideal transformer stated.',
      'Identifies copper loss, eddy currents, or flux leakage as loss sources.',
      'Mentions laminated core reduces eddy currents.',
      'Explains effect of increased load current on efficiency.',
      'Draws conclusion tying design choices to efficiency.',
    ],
  },
  {
    id: 'slide-coach',
    type: 'coaching',
    title: 'Highlighting the wins',
    summary: 'Students demonstrated confident use of key terminology and diagrammatic reasoning.',
    bullets: [
      'Accurate definitions for work, energy, and power show strong recall.',
      'Efficient calculation structure already in place—build on this with quick units checks.',
      'Most students justified their reasoning with method steps rather than guesswork.',
    ],
  },
  {
    id: 'slide-feedback',
    type: 'auto-feedback',
    title: 'Automatic feedback generated',
    verdict: 'caution',
    summary: `Energy transfer explanations in ${subjectName} are developing but need reinforcement.`,
    bullets: [
      'Recommend reteaching transformer efficiency with applied numerical contexts.',
      'Share exam-planner tasks focused on reducing careless definition slips.',
      'Add retrieval practice on core equations linking power, voltage, and current.',
    ],
  },
];

const buildResultsSummary = (subjectName: string): ResultsSummary => ({
  achieved: 72,
  total: 90,
  createdOn: '25 Mar 2024 · 09:45',
  weaker: {
    title: 'Recommend reteach',
    description: `Schedule a short ${subjectName} reteach to close gaps before the mock exam window.`,
    topics: ['Transformer efficiency', 'Conservation of energy in practice', 'Exam vocabulary precision'],
  },
  stronger: {
    title: 'Strength to celebrate',
    description: `Highlight ${subjectName} strengths to boost motivation and ownership.`,
    topics: ['Power calculations', 'MCQ reasoning speed', 'Applied data interpretation'],
  },
  breakdown: [
    { question: '1', marks: '3 / 4', tone: 'positive' },
    { question: '2', marks: '4 / 6', tone: 'caution' },
    { question: '3', marks: '5 / 6', tone: 'positive' },
    { question: '4', marks: '2 / 6', tone: 'urgent' },
    { question: '5', marks: '8 / 10', tone: 'positive' },
  ],
});

interface TargetTestPageProps {
  context: ResourceContext;
}

export const TargetTestPage = ({ context }: TargetTestPageProps) => {
  const { level, subject, board } = context;
  const subjectName = subject.name;

  const topicSections = useMemo(() => buildTopicSections(context), [context]);
  const reviewSlides = useMemo(() => buildReviewSlides(subjectName), [subjectName]);
  const finalResultsSummary = useMemo(() => buildResultsSummary(subjectName), [subjectName]);

  const defaultTopicIds = useMemo(() => topicSections.flatMap((section) => section.topics.map((topic) => topic.id)).slice(0, 3), [topicSections]);

  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    defaultTopicIds.forEach((id) => {
      initial[id] = true;
    });
    return initial;
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    topicSections.forEach((section, index) => {
      initial[section.id] = index < 2;
    });
    return initial;
  });

  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<Record<QuestionTypeOptionId, boolean>>({
    mcq: true,
    structured: true,
    calculation: false,
    mixed: false,
  });

  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<DifficultyOptionId, boolean>>({
    easy: false,
    medium: true,
    hard: false,
  });

  const [testLength, setTestLength] = useState(45);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<ModalStage>('topics');
  const [marksAwarded, setMarksAwarded] = useState<Record<string, number | ''>>({});
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showMarkWarning, setShowMarkWarning] = useState(false);

  const selectedTopicTitles = useMemo(() => {
    const titles: string[] = [];
    topicSections.forEach((section) => {
      section.topics.forEach((topic) => {
        if (selectedTopics[topic.id]) {
          titles.push(topic.title);
        }
      });
    });
    return titles;
  }, [topicSections, selectedTopics]);

  const totalSelected = selectedTopicTitles.length;
  const selectedQuestionTypeCount = Object.values(selectedQuestionTypes).filter(Boolean).length;
  const selectedDifficultyCount = Object.values(selectedDifficulties).filter(Boolean).length;

  const selectedQuestionTypeLabels = questionTypeOptions
    .filter((option) => selectedQuestionTypes[option.id])
    .map((option) => option.label);

  const selectedDifficultyLabels = difficultyOptions
    .filter((option) => selectedDifficulties[option.id])
    .map((option) => option.label);

  const estimatedQuestionCount = Math.max(6, totalSelected * Math.max(1, selectedQuestionTypeCount));

  const currentReviewSlide = reviewSlides[currentReviewIndex] ?? reviewSlides[0];
  const reviewProgressFraction = reviewSlides.length > 0 ? (currentReviewIndex + 1) / reviewSlides.length : 0;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalStage('topics');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalStage('topics');
    setCurrentReviewIndex(0);
    setShowMarkWarning(false);
  };

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleToggleSectionTopics = (sectionId: string) => {
    const section = topicSections.find((candidate) => candidate.id === sectionId);
    if (!section) {
      return;
    }
    const areAllSelected = section.topics.every((topic) => selectedTopics[topic.id]);
    setSelectedTopics((prev) => {
      const updated = { ...prev };
      section.topics.forEach((topic) => {
        updated[topic.id] = !areAllSelected;
      });
      return updated;
    });
  };

  const handleToggleSectionExpanded = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleProceedToSettings = () => {
    if (totalSelected > 0) {
      setModalStage('settings');
    }
  };

  const clearSelection = () => {
    setSelectedTopics({});
  };

  const handleBackToTopics = () => {
    setModalStage('topics');
  };

  const handleToggleQuestionType = (optionId: QuestionTypeOptionId) => {
    setSelectedQuestionTypes((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const handleToggleDifficulty = (optionId: DifficultyOptionId) => {
    setSelectedDifficulties((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const handleLaunchTest = () => {
    if (selectedQuestionTypeCount > 0 && selectedDifficultyCount > 0) {
      setModalStage('attempt');
    }
  };

  const handleBackToSettings = () => {
    setModalStage('settings');
  };

  const handleAttemptContinue = () => {
    setModalStage('reviewIntro');
  };

  const handleStartReview = () => {
    setModalStage('marking');
    setCurrentReviewIndex(0);
    setShowMarkWarning(false);
  };

  const handleReviewPrevious = () => {
    setShowMarkWarning(false);
    if (currentReviewIndex === 0) {
      setModalStage('reviewIntro');
      return;
    }
    setCurrentReviewIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSetMarkForSlide = (slideId: string, rawValue: string, maxMarks: number) => {
    if (rawValue.trim() === '') {
      setMarksAwarded((prev) => ({
        ...prev,
        [slideId]: '',
      }));
      setShowMarkWarning(false);
      return;
    }

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
      return;
    }

    const clamped = Math.min(Math.max(parsed, 0), maxMarks);
    setMarksAwarded((prev) => ({
      ...prev,
      [slideId]: clamped,
    }));
    setShowMarkWarning(false);
  };

  const handleAdvanceReview = () => {
    const slide = reviewSlides[currentReviewIndex];
    if (slide?.type === 'manual-mark') {
      const value = marksAwarded[slide.id];
      if (value === undefined || value === '' || Number.isNaN(value)) {
        setShowMarkWarning(true);
        return;
      }
    }

    setShowMarkWarning(false);

    if (currentReviewIndex < reviewSlides.length - 1) {
      setCurrentReviewIndex((prev) => prev + 1);
      return;
    }

    setModalStage('results');
  };

  const handleReviewTestFromResults = () => {
    setModalStage('marking');
    setCurrentReviewIndex(0);
    setShowMarkWarning(false);
  };

  const renderProgressBar = (progressFraction: number) => (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
      <div
  className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-info)] to-[var(--color-success)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(progressFraction, 1)) * 100}%` }}
      />
    </div>
  );

  return (
    <SiteLayout>
      <div className="space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Launchpad
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{level.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{subject.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Target Test</span>
        </nav>

        <header className="space-y-6 rounded-3xl border border-slate-800/70 bg-[#0b1423] p-8 text-slate-200 shadow-lg shadow-black/40">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                Target Test
              </p>
              <h1 className="text-3xl font-semibold text-white">
                Create personalised {board.name} {subject.name} tests
              </h1>
              <p className="text-sm text-slate-300">
                Craft bespoke assessments that align with the latest specification. Blend question styles, set time limits, and export ready-to-use packs for class practice or homework.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                  Exam code: {board.examCode ?? 'N/A'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                  Tailored topic coverage
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                  Marking with feedback prompts
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 text-sm">
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 font-semibold text-white transition hover:bg-sky-400"
              >
                Launch Target Test
              </button>
              <p className="text-xs text-slate-400">Generate PDF packs or share a live attempt link with your class.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Student experience</p>
              <p className="mt-2 text-sm text-slate-200">Adaptive timer guidance keeps learners on pace.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Teacher tools</p>
              <p className="mt-2 text-sm text-slate-200">Manual marking journey captures scores and suggested feedback.</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Insights</p>
              <p className="mt-2 text-sm text-slate-200">Results summary flags reteach priorities and quick wins.</p>
            </div>
          </div>
        </header>

        <section className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Build by topic</h2>
            <p className="text-sm text-slate-400">
              Start with your focus areas. We will assemble question pools across multiple papers and difficulty bands.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-slate-200">
              <h3 className="text-xl font-semibold text-white">Popular focus areas</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3">
                  Weekly mastery check mixing topic retrieval and mid-tier calculations.
                </li>
                <li className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3">
                  Consolidation pack of your half-term topics with instant feedback.
                </li>
                <li className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3">
                  Challenge set for high attainers prepping for paper 3 and 4.
                </li>
              </ul>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-slate-200">
              <h3 className="text-xl font-semibold text-white">Tips to share</h3>
              <p className="text-sm text-slate-300">
                Encourage students to annotate mark schemes with alternative approaches. Use their reflections to co-create follow-up tasks.
              </p>
              <Link
                to="#"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
              >
                Collab ideas for your department →
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-slate-200">
            <h2 className="text-xl font-semibold text-white">How it works</h2>
            <ol className="space-y-3 text-sm text-slate-300">
              {['Choose topics to target', 'Blend question styles and difficulty', 'Share with your class or export a pack', 'Mark with guided feedback', 'Review insights and assign follow-up'].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-sky-500 text-sm font-semibold text-sky-300">
                    {index + 1}
                  </span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ol>
            <div className="rounded-2xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-xs text-sky-200">
              <p className="font-semibold text-white">Top tip</p>
              <p className="mt-1 text-slate-200">Keep tests short to focus on mastery. Use Target Test weekly to track exam readiness.</p>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-slate-200">
            <h2 className="text-xl font-semibold text-white">Popular setups</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3">10 question checkpoint on core mechanics topics.</li>
              <li className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3">Mix of Paper 1 and Paper 2 items for mixed-ability groups.</li>
              <li className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-3">Timed challenge on recent past-paper structured questions.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-[#0b172a] p-6 text-sm text-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">Bring Target Test to your classroom</p>
              <p className="max-w-2xl text-slate-300">
                Combine Target Test with our exam questions and past paper library to build a complete assessment plan. Share feedback in minutes and keep students on track for grade goals.
              </p>
            </div>
            <Link
              to="#"
              className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
            >
              Explore educator tools →
            </Link>
          </div>
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/80" aria-hidden onClick={handleCloseModal} />
          <div className="relative z-10 flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-800/70 bg-[#0b1423] text-slate-200 shadow-2xl shadow-black/40">
            {(() => {
              switch (modalStage) {
                case 'topics':
                  return (
                    <div className="flex h-full flex-col">
                      <header className="flex items-center justify-between border-b border-slate-800/70 px-6 py-5">
                        <div>
                          <h2 className="text-2xl font-semibold text-white">Choose your topics</h2>
                          <p className="mt-1 text-sm text-slate-400">Select the areas you want to assess. We will include as many as possible in the generated test.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-sky-500 hover:text-white"
                          aria-label="Close chooser"
                        >
                          ×
                        </button>
                      </header>

                      <div className="flex-1 overflow-y-auto px-6 py-5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>
                            {totalSelected} topic{totalSelected === 1 ? '' : 's'} selected
                          </span>
                          <button
                            type="button"
                            onClick={clearSelection}
                            className="text-sky-400 transition hover:text-sky-300"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="mt-4 space-y-3">
                          {topicSections.map((section) => {
                            const allSelected = section.topics.every((topic) => selectedTopics[topic.id]);
                            const partiallySelected = !allSelected && section.topics.some((topic) => selectedTopics[topic.id]);
                            const isExpanded = expandedSections[section.id];
                            return (
                              <div key={section.id} className="rounded-2xl border border-slate-800/70 bg-[#101c33]">
                                <div className="flex items-center justify-between px-4 py-3">
                                  <label className="flex flex-1 items-center gap-3 text-sm font-semibold text-slate-200">
                                    <input
                                      type="checkbox"
                                      checked={allSelected}
                                      onChange={() => handleToggleSectionTopics(section.id)}
                                      ref={(element) => {
                                        if (element) {
                                          element.indeterminate = partiallySelected;
                                        }
                                      }}
                                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                    />
                                    <span>{section.title || `Section {index + 1}`}</span>
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSectionExpanded(section.id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/70 text-xs text-slate-400 transition hover:border-sky-500 hover:text-white"
                                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                                  >
                                    {isExpanded ? '⌃' : '⌄'}
                                  </button>
                                </div>
                                {isExpanded ? (
                                  <div className="border-t border-slate-800/70 px-6 py-3">
                                    <ul className="space-y-2 text-sm text-slate-300">
                                      {section.topics.map((topic) => (
                                        <li key={topic.id} className="flex items-center gap-3">
                                          <input
                                            id={topic.id}
                                            type="checkbox"
                                            checked={Boolean(selectedTopics[topic.id])}
                                            onChange={() => handleToggleTopic(topic.id)}
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                          />
                                          <label htmlFor={topic.id} className="cursor-pointer select-none">
                                            {topic.title}
                                          </label>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <footer className="border-t border-slate-800/70 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <p className="text-sm text-slate-400">We will tailor questions to cover your selected topics and spread marks evenly.</p>
                          <button
                            type="button"
                            onClick={handleProceedToSettings}
                            className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition ${
                              totalSelected === 0
                                ? 'cursor-not-allowed border border-slate-700/70 text-slate-500'
                                : 'border border-sky-500 bg-sky-500 text-white hover:bg-sky-400'
                            }`}
                            disabled={totalSelected === 0}
                          >
                            Continue
                            <span className="text-base">→</span>
                          </button>
                        </div>
                      </footer>
                    </div>
                  );
                case 'settings':
                  return (
                    <div className="flex h-full flex-col">
                      <header className="flex items-center justify-between border-b border-slate-800/70 px-6 py-5">
                        <div>
                          <h2 className="text-2xl font-semibold text-white">Personalise your test</h2>
                          <p className="mt-1 text-sm text-slate-400">Mix question types, difficulty bands, and estimated duration.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-sky-500 hover:text-white"
                          aria-label="Close personalisation"
                        >
                          ×
                        </button>
                      </header>

                      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-sm text-slate-200">
                        <section className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                          <div>
                            <h3 className="text-base font-semibold text-white">Question type</h3>
                            <p className="text-xs text-slate-400">Select at least one question type.</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            {questionTypeOptions.map((option) => {
                              const isActive = Boolean(selectedQuestionTypes[option.id]);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => handleToggleQuestionType(option.id)}
                                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition ${
                                    isActive
                                      ? 'border-sky-500 bg-sky-500/15 text-white'
                                      : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                                  }`}
                                >
                                  <span className="flex flex-col gap-1">
                                    <span className="text-sm">{option.label}</span>
                                    <span className="text-[11px] font-normal text-slate-400">{option.helper}</span>
                                  </span>
                                  <span className="text-slate-400">{isActive ? '✓' : '+'}</span>
                                </button>
                              );
                            })}
                          </div>
                        </section>

                        <section className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                          <div>
                            <h3 className="text-base font-semibold text-white">Question difficulty</h3>
                            <p className="text-xs text-slate-400">Select at least one difficulty.</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            {difficultyOptions.map((option) => {
                              const isActive = Boolean(selectedDifficulties[option.id]);
                              const activeStyles =
                                option.id === 'easy'
                                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200'
                                  : option.id === 'hard'
                                  ? 'border-rose-500 bg-rose-500/15 text-rose-200'
                                  : 'border-amber-500 bg-amber-500/15 text-amber-200';
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => handleToggleDifficulty(option.id)}
                                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition ${
                                    isActive
                                      ? activeStyles
                                      : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                                  }`}
                                >
                                  <span className="flex flex-col gap-1">
                                    <span className="text-sm">{option.label}</span>
                                    <span className="text-[11px] font-normal text-slate-400">{option.helper}</span>
                                  </span>
                                  <span className="text-slate-400">{isActive ? '✓' : '+'}</span>
                                </button>
                              );
                            })}
                          </div>
                        </section>

                        <section className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                          <div>
                            <h3 className="text-base font-semibold text-white">Test length</h3>
                            <p className="text-xs text-slate-400">Choose how long the test should take. We will aim for this duration.</p>
                          </div>
                          <div className="space-y-4">
                            <input
                              type="range"
                              min={15}
                              max={120}
                              step={5}
                              value={testLength}
                              onChange={(event) => setTestLength(Number(event.target.value))}
                              className="w-full accent-sky-500"
                              aria-label="Test length in minutes"
                            />
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>15 minutes</span>
                              <span>{testLength} minutes</span>
                              <span>120 minutes</span>
                            </div>
                          </div>
                        </section>
                      </div>

                      <footer className="border-t border-slate-800/70 bg-[#08101d] p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={handleBackToTopics}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white"
                            >
                              Back to topics
                            </button>
                            <span>
                              {selectedQuestionTypeCount} question type{selectedQuestionTypeCount === 1 ? '' : 's'}, {selectedDifficultyCount} difficulty{selectedDifficultyCount === 1 ? '' : 'ies'} selected
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
                                selectedQuestionTypeCount > 0 && selectedDifficultyCount > 0
                                  ? 'border border-slate-700/70 text-slate-200 hover:border-sky-500 hover:text-white'
                                  : 'cursor-not-allowed border border-slate-800/70 text-slate-600'
                              }`}
                              disabled={selectedQuestionTypeCount === 0 || selectedDifficultyCount === 0}
                            >
                              Launch as PDF
                            </button>
                            <button
                              type="button"
                              onClick={handleLaunchTest}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
                                selectedQuestionTypeCount > 0 && selectedDifficultyCount > 0
                                  ? 'border border-sky-500 bg-sky-500 text-white hover:bg-sky-400'
                                  : 'cursor-not-allowed border border-slate-800/70 text-slate-600'
                              }`}
                              disabled={selectedQuestionTypeCount === 0 || selectedDifficultyCount === 0}
                            >
                              Launch test 🚀
                            </button>
                          </div>
                        </div>
                      </footer>
                    </div>
                  );
                case 'attempt':
                  return (
                    <div className="flex h-full flex-col">
                      <header className="flex items-center justify-between border-b border-slate-800/70 px-6 py-5">
                        <div>
                          <h2 className="text-2xl font-semibold text-white">Target test ready</h2>
                          <p className="mt-1 text-sm text-slate-400">Share the link with your class or project it on screen. Mark schemes are attached.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-sky-500 hover:text-white"
                          aria-label="Close test"
                        >
                          ×
                        </button>
                      </header>

                      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                        <div className="grid gap-4 lg:grid-cols-3">
                          <div className="rounded-2xl border border-sky-500/50 bg-sky-500/10 px-5 py-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Duration</p>
                            <p className="mt-2 text-2xl font-semibold text-white">{testLength} mins</p>
                            <p className="mt-1 text-xs text-slate-300">We will balance timings per question.</p>
                          </div>
                          <div className="rounded-2xl border border-violet-500/50 bg-violet-500/10 px-5 py-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-violet-200">Question count</p>
                            <p className="mt-2 text-2xl font-semibold text-white">{estimatedQuestionCount}</p>
                            <p className="mt-1 text-xs text-slate-300">Mix of {selectedQuestionTypeLabels.join(', ') || 'selected types'}.</p>
                          </div>
                          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Difficulty blend</p>
                            <p className="mt-2 text-2xl font-semibold text-white">{selectedDifficultyLabels.join(' · ')}</p>
                            <p className="mt-1 text-xs text-slate-300">Adaptive to student performance over time.</p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-base font-semibold text-white">Topics covered</h3>
                              <p className="text-xs text-slate-400">{selectedTopicTitles.length ? 'Add or remove topics any time.' : 'No topics selected yet.'}</p>
                            </div>
                            <button
                              type="button"
                              onClick={handleBackToSettings}
                              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                            >
                              Adjust selections
                            </button>
                          </div>
                          <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                            {selectedTopicTitles.length ? (
                              selectedTopicTitles.map((title) => (
                                <li key={title} className="flex items-center gap-2 rounded-xl border border-slate-800/70 bg-[#0f1c31] px-3 py-2">
                                  <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
                                  {title}
                                </li>
                              ))
                            ) : (
                              <li className="rounded-xl border border-slate-800/70 bg-[#0f1c31] px-3 py-2 text-xs text-slate-400">
                                Select topics to tailor this test.
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5 text-sm text-slate-300">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">What next?</p>
                          <p className="mt-2 text-white">Share the attempt link or export a printable pack. When students finish, upload their responses to begin marking.</p>
                          <div className="mt-4 flex flex-wrap gap-3 text-xs">
                            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white">
                              Copy student link
                            </button>
                            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white">
                              Export PDF + mark scheme
                            </button>
                          </div>
                        </div>
                      </div>

                      <footer className="border-t border-slate-800/70 bg-[#08101d] p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="text-xs text-slate-400">Once students have completed the test, return here to review and award marks.</div>
                          <button
                            type="button"
                            onClick={handleAttemptContinue}
                            className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                          >
                            I've finished the attempt →
                          </button>
                        </div>
                      </footer>
                    </div>
                  );
                case 'reviewIntro':
                  return (
                    <div className="flex h-full flex-col">
                      <header className="flex items-center justify-between border-b border-slate-800/70 px-6 py-5">
                        <div>
                          <h2 className="text-2xl font-semibold text-white">Review responses</h2>
                          <p className="mt-1 text-sm text-slate-400">Step through each question, award marks, and capture feedback in minutes.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="inline-flex h-9 w-9 itemscenter justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-sky-500 hover:text-white"
                          aria-label="Close review intro"
                        >
                          ×
                        </button>
                      </header>

                      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 text-sm text-slate-200">
                        <div className="grid gap-4 lg:grid-cols-3">
                          <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next step</p>
                            <p className="mt-2 text-base font-semibold text-white">Manual marking journey</p>
                            <p className="mt-2 text-slate-300">We grouped answers by mark scheme so you can award marks quickly with suggested feedback.</p>
                          </div>
                          <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Auto-suggested</p>
                            <p className="mt-2 text-base font-semibold text-white">Personalised recommendations</p>
                            <p className="mt-2 text-slate-300">We will flag misconceptions and assemble reteach tasks as you mark.</p>
                          </div>
                          <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Students</p>
                            <p className="mt-2 text-base font-semibold text-white">Attach written responses</p>
                            <p className="mt-2 text-slate-300">You can upload photos or PDFs to store annotated scripts alongside results.</p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-sky-500/40 bg-sky-500/10 px-5 py-4 text-xs text-sky-100">
                          <p className="font-semibold text-white">Need a co-teacher?</p>
                          <p className="mt-1 text-slate-200">Share the review link so a colleague can help mark simultaneously.</p>
                        </div>
                      </div>

                      <footer className="border-t border-slate-800/70 bg-[#08101d] p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={handleBackToSettings}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold transition hover:border-sky-500 hover:text-white"
                          >
                            Back to test overview
                          </button>
                          <button
                            type="button"
                            onClick={handleStartReview}
                            className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                          >
                            Start marking →
                          </button>
                        </div>
                      </footer>
                    </div>
                  );
                case 'marking':
                  return (
                    <div className="flex h-full flex-col">
                      <header className="space-y-4 border-b border-slate-800/70 px-6 py-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-semibold text-white">Marking in progress</h2>
                            <p className="mt-1 text-sm text-slate-400">{currentReviewSlide.title}</p>
                          </div>
                          <div className="text-xs text-slate-400">Slide {currentReviewIndex + 1} of {reviewSlides.length}</div>
                        </div>
                        {renderProgressBar(reviewProgressFraction)}
                      </header>

                      <div className="flex-1 overflow-y-auto px-6 py-6">
                        {currentReviewSlide.type === 'manual-mark' ? (
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Student response</p>
                                  <p className="mt-1 text-sm text-slate-300">{currentReviewSlide.questionContext}</p>
                                </div>
                                <div className="text-right text-xs text-slate-400">Max {currentReviewSlide.maxMarks} marks</div>
                              </div>
                              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-200">{currentReviewSlide.studentAnswer}</p>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                              <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Focus points</p>
                                <ul className="space-y-2 text-sm text-slate-300">
                                  {currentReviewSlide.focusPoints.map((point) => (
                                    <li key={point} className="flex items-start gap-2">
                                      <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-400" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mark scheme</p>
                                <ul className="space-y-2 text-sm text-slate-300">
                                  {currentReviewSlide.markScheme.map((line) => (
                                    <li key={line} className="rounded-xl border border-slate-800/70 bg-[#0f1c31] px-3 py-2">{line}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Award marks</p>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                                <input
                                  type="number"
                                  min={0}
                                  max={currentReviewSlide.maxMarks}
                                  value={marksAwarded[currentReviewSlide.id] ?? ''}
                                  onChange={(event) => handleSetMarkForSlide(currentReviewSlide.id, event.target.value, currentReviewSlide.maxMarks)}
                                  className="w-24 rounded-xl border border-slate-700/70 bg-slate-900 px-3 py-2 text-right text-white outline-none focus:border-sky-500"
                                />
                                <span className="text-slate-400">/ {currentReviewSlide.maxMarks}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {currentReviewSlide.type === 'coaching' ? (
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Highlights</p>
                              <p className="mt-2 text-base font-semibold text-white">{currentReviewSlide.title}</p>
                              <p className="mt-2 text-sm text-slate-300">{currentReviewSlide.summary}</p>
                              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                {currentReviewSlide.bullets.map((item) => (
                                  <li key={item} className="flex items-start gap-2">
                                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-400" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : null}

                        {currentReviewSlide.type === 'auto-feedback' ? (
                          <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Smart insight</p>
                                  <p className="mt-2 text-base font-semibold text-white">{currentReviewSlide.title}</p>
                                </div>
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                    currentReviewSlide.verdict === 'positive'
                                      ? 'border border-emerald-500/60 text-emerald-200'
                                      : currentReviewSlide.verdict === 'caution'
                                      ? 'border border-amber-500/60 text-amber-200'
                                      : 'border border-rose-500/60 text-rose-200'
                                  }`}
                                >
                                  {currentReviewSlide.verdict === 'positive'
                                    ? 'On track'
                                    : currentReviewSlide.verdict === 'caution'
                                    ? 'Needs attention'
                                    : 'Urgent action'}
                                </span>
                              </div>
                              <p className="mt-3 text-sm text-slate-300">{currentReviewSlide.summary}</p>
                              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                {currentReviewSlide.bullets.map((item) => (
                                  <li key={item} className="flex items-start gap-2">
                                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-400" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <footer className="space-y-3 border-t border-slate-800/70 bg-[#08101d] p-6">
                        {showMarkWarning ? (
                          <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">Please enter the marks for this question before moving on.</div>
                        ) : null}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={handleReviewPrevious}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold transition hover:border-sky-500 hover:text-white"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleAdvanceReview}
                            className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                          >
                            {currentReviewIndex === reviewSlides.length - 1 ? 'Finish marking' : 'Next slide →'}
                          </button>
                        </div>
                      </footer>
                    </div>
                  );
                case 'results':
                  return (
                    <div className="flex h-full flex-col">
                      <header className="flex items-center justify-between border-b border-slate-800/70 px-6 py-5">
                        <div>
                          <h2 className="text-2xl font-semibold text-white">Results ready to share</h2>
                          <p className="mt-1 text-sm text-slate-400">Download mark summaries, assign follow-up tasks, or continue refining feedback.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-sky-500 hover:text-white"
                          aria-label="Close results"
                        >
                          ×
                        </button>
                      </header>

                      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 text-sm text-slate-200">
                        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                          <div className="space-y-4 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Score achieved</p>
                                <p className="mt-2 text-3xl font-semibold text-white">{finalResultsSummary.achieved} / {finalResultsSummary.total}</p>
                              </div>
                              <div className="text-xs text-slate-400">Generated {finalResultsSummary.createdOn}</div>
                            </div>
                            <p className="text-xs text-slate-400">Grades predicted: A*</p>
                          </div>
                          <div className="space-y-4 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Share</p>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white">
                                Copy parent summary
                              </button>
                              <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white">
                                Export CSV
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{finalResultsSummary.weaker.title}</p>
                            <p className="text-sm text-slate-300">{finalResultsSummary.weaker.description}</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-300">
                              {finalResultsSummary.weaker.topics.map((topic) => (
                                <li key={topic} className="rounded-xl border border-slate-800/70 bg-[#0f1c31] px-3 py-2">{topic}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{finalResultsSummary.stronger.title}</p>
                            <p className="text-sm text-slate-300">{finalResultsSummary.stronger.description}</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-300">
                              {finalResultsSummary.stronger.topics.map((topic) => (
                                <li key={topic} className="rounded-xl border border-slate-800/70 bg-[#0f1c31] px-3 py-2">{topic}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Question breakdown</p>
                          <div className="mt-4 grid gap-2 text-xs text-slate-300">
                            {finalResultsSummary.breakdown.map((row) => (
                              <div
                                key={row.question}
                                className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                                  row.tone === 'positive'
                                    ? 'border-emerald-500/40 bg-emerald-500/10'
                                    : row.tone === 'caution'
                                    ? 'border-amber-500/40 bg-amber-500/10'
                                    : 'border-rose-500/40 bg-rose-500/10'
                                }`}
                              >
                                <span className="font-semibold text-white">Question {row.question}</span>
                                <span className="text-sm">{row.marks}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <footer className="border-t border-slate-800/70 bg-[#08101d] p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={handleReviewTestFromResults}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold transition hover:border-sky-500 hover:text-white"
                          >
                            Review again
                          </button>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white">
                              Assign follow-up
                            </button>
                            <button
                              type="button"
                              onClick={handleCloseModal}
                              className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                            >
                              Close results
                            </button>
                          </div>
                        </div>
                      </footer>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </div>
        </div>
      ) : null}
    </SiteLayout>
  );
}
