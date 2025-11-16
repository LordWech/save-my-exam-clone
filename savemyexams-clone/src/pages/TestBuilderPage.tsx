import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import type { ResourceContext } from '../data/resources';

interface TestBuilderPageProps {
  context: ResourceContext;
}

type BuilderStage = 'overview' | 'bank' | 'preview' | 'markScheme';

type DifficultyLevel = 'easy' | 'medium' | 'hard';

type Question = {
  id: string;
  title: string;
  topic: string;
  marks: number;
  difficulty: DifficultyLevel;
  prompt: string;
  questionType: 'mcq' | 'structured';
  options?: string[];
  imageUrl?: string;
  markScheme: string[];
};

const questionBank: Question[] = [
  {
    id: 'q1',
    title: 'Resonance',
    topic: 'Waves and Oscillations',
    marks: 6,
    difficulty: 'medium',
    prompt:
      'The photograph shows a singing bowl. When the handles are rubbed with both hands the bowl “sings”, producing a loud note with a frequency of 270 Hz. Explain the observations in terms of resonance and energy transfer.',
    questionType: 'structured',
    imageUrl: 'https://images.ctfassets.net/wl95ljfippl8/1Efa7saEHeWtE8YKpLdakc/4bf01d8ea1d2235f2310329af1a806de/singing-bowl.png',
    markScheme: [
      'Reference to driving frequency matching a natural frequency.',
      'Energy transfer from rubbing to standing wave in the bowl walls.',
      'Produces a large amplitude vibration due to resonance.',
      'Sound emitted as air is set into vibration.',
      'Mention of damping determining duration of sound.',
      'Use of 270 Hz in context or comparison with harmonics.',
    ],
  },
  {
    id: 'q2',
    title: 'Circular Motion',
    topic: 'Mechanics',
    marks: 10,
    difficulty: 'medium',
    prompt:
      'The photograph shows a model racing car track. The curved parts of the track are semicircular. The car makes electrical contact with the track to receive power. Discuss the forces acting on the car as it travels at constant speed around the curve and explain how engineers ensure the car maintains contact with the track.',
    questionType: 'structured',
    markScheme: [
      'Identifies centripetal force pointing towards the centre.',
      'States F = mv² / r relationship.',
      'Mentions friction and normal contact providing resultant force.',
      'Describes role of banking or guide wheels.',
      'Explains loss of contact if speed too high.',
      'Relates engineering choices to safety factor.',
      'Discusses energy supplied via track connections.',
      'Includes numerical estimate or substitution for typical values.',
      'Comment on power delivery affecting mass and friction.',
      'Quality of written communication.',
    ],
  },
  {
    id: 'q3',
    title: 'Base SI Unit',
    topic: 'Working as a Physicist',
    marks: 1,
    difficulty: 'easy',
    prompt: 'Which of the following is a base SI unit?',
    questionType: 'mcq',
    options: ['ampere', 'coulomb', 'joule', 'newton'],
    markScheme: ['Correct answer: ampere.'],
  },
  {
    id: 'q4',
    title: 'Accuracy vs Precision',
    topic: 'Working as a Physicist',
    marks: 4,
    difficulty: 'easy',
    prompt:
      'A teacher is explaining the differences between accuracy and precision to her students. She draws the following diagram and asks the class to describe what it shows. Explain the difference between accuracy and precision and give an example for each.',
    questionType: 'structured',
    markScheme: [
      'Defines accuracy as closeness to true value.',
      'Defines precision as repeatability or number of significant figures.',
      'Provides example of accurate but imprecise data.',
      'Provides example of precise but inaccurate data.',
    ],
  },
  {
    id: 'q5',
    title: 'Moments',
    topic: 'Mechanics',
    marks: 1,
    difficulty: 'medium',
    prompt: 'A person uses a pivoted lever to lift a boulder of weight W. State the principle of moments for the lever in equilibrium.',
    questionType: 'structured',
    markScheme: ['Clockwise moments equal anticlockwise moments about the pivot.'],
  },
  {
    id: 'q6',
    title: 'Photoelectric Effect',
    topic: 'Quantum Physics',
    marks: 11,
    difficulty: 'medium',
    prompt:
      'A student has been learning about the photoelectric effect. The student was asked by their teacher to explain the photoelectric effect. Give a detailed answer including relevant equations and typical values.',
    questionType: 'structured',
    markScheme: [
      'States photons transfer energy hf to electrons.',
      'Mentions work function and threshold frequency.',
      'Provides equation hf = φ + KEmax.',
      'Explains stopping potential measurement.',
      'References instantaneous emission and one-to-one interactions.',
      'Discusses intensity affecting number of electrons.',
      'Cites supporting experiments (e.g. Millikan).',
      'Includes typical frequency values.',
      'Mentions failure of classical wave theory.',
      'Provides conclusion on particle nature of light.',
      'Quality of written communication.',
    ],
  },
  {
    id: 'q7',
    title: 'Modelling Resistance',
    topic: 'Electric Circuits',
    marks: 9,
    difficulty: 'medium',
    prompt:
      'A coil of 1.5 m, 1.5 V is connected to a 5.0 Ω resistor. The terminal potential difference across the cells is 1.0 V. Which of the following statements best describes the behaviour of the circuit?',
    questionType: 'mcq',
    options: ['The current is 0.2 A', 'The internal resistance is 2.5 Ω', 'The emf is 1.0 V', 'The terminal pd equals emf at all times'],
    markScheme: ['Correct answer: The current is 0.2 A.'],
  },
];

const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const TestBuilderPage = ({ context }: TestBuilderPageProps) => {
  const { level, subject, board } = context;
  const [stage, setStage] = useState<BuilderStage>('overview');
  const [selectedIds, setSelectedIds] = useState<string[]>(['q1', 'q3']);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string | null>(null);
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<DifficultyLevel | null>(null);

  const visibleQuestions = useMemo(() => {
    return questionBank.filter((question) => {
      const matchesTopic = activeTopicFilter ? question.topic === activeTopicFilter : true;
      const matchesDifficulty = activeDifficultyFilter ? question.difficulty === activeDifficultyFilter : true;
      return matchesTopic && matchesDifficulty;
    });
  }, [activeDifficultyFilter, activeTopicFilter]);

  const selectedQuestions = useMemo(
    () => questionBank.filter((question) => selectedIds.includes(question.id)),
    [selectedIds],
  );

  const totalMarksSelected = selectedQuestions.reduce((sum, question) => sum + question.marks, 0);

  const uniqueTopics = useMemo(() => Array.from(new Set(questionBank.map((question) => question.topic))), []);

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      }
      return [...prev, questionId];
    });
  };

  const stageIndicatorLabel = stage === 'overview' ? 'Overview' : stage === 'bank' ? 'Build test' : stage === 'preview' ? 'Preview PDF' : 'Mark scheme';

  const questionCountLabel = `${selectedQuestions.length} question${selectedQuestions.length === 1 ? '' : 's'}`;

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
          <span className="text-slate-200">Test Builder</span>
        </nav>

        {stage === 'overview' ? (
          <section className="space-y-8">
            <header className="space-y-3">
              <h1 className="text-3xl font-semibold text-white">Your tests for {board.name} {subject.name}</h1>
              <p className="text-sm text-slate-400">Adaptable practice for every ability, made easy.</p>
            </header>
            <div className="rounded-3xl border border-slate-800/70 bg-[#0d172c] p-10 text-slate-200 shadow-xl shadow-black/40">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-300">
                  <span className="inline-flex min-w-[10rem] flex-col gap-1 rounded-2xl border border-slate-700/70 bg-[#101c33] px-5 py-4">
                    <strong className="text-base text-white">Homework</strong>
                    <span>Quick start sets for consolidation</span>
                  </span>
                  <span className="inline-flex min-w-[10rem] flex-col gap-1 rounded-2xl border border-slate-700/70 bg-[#101c33] px-5 py-4">
                    <strong className="text-base text-white">Class exercise</strong>
                    <span>Mix of MCQs and multi-mark questions</span>
                  </span>
                  <span className="inline-flex min-w-[10rem] flex-col gap-1 rounded-2xl border border-slate-700/70 bg-[#101c33] px-5 py-4">
                    <strong className="text-base text-white">End-of-topic test</strong>
                    <span>Printable pack with mark scheme</span>
                  </span>
                </div>
                <p className="max-w-xl text-sm text-slate-300">
                  From first lessons to final practice, Test Builder helps you set quick homework, classwork, and topic tests in just a few clicks. Pick questions, preview the PDF, and download mark schemes instantly.
                </p>
                <button
                  type="button"
                  onClick={() => setStage('bank')}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Start building
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {stage !== 'overview' ? (
          <section className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stageIndicatorLabel}</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Untitled test</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="rounded-full border border-slate-700/70 px-3 py-1">{selectedQuestions.length > 0 ? `${totalMarksSelected} marks` : 'Select questions to begin'}</span>
                {stage === 'bank' ? (
                  <button
                    type="button"
                    onClick={() => setStage('preview')}
                    disabled={selectedQuestions.length === 0}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedQuestions.length === 0
                        ? 'cursor-not-allowed border border-slate-700/70 text-slate-600'
                        : 'border border-sky-500 bg-sky-500 text-white hover:bg-sky-400'
                    }`}
                  >
                    Preview test
                  </button>
                ) : null}
                {stage === 'preview' ? (
                  <button
                    type="button"
                    onClick={() => setStage('markScheme')}
                    className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Mark scheme view
                  </button>
                ) : null}
                {stage === 'markScheme' ? (
                  <button
                    type="button"
                    onClick={() => setStage('preview')}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
                  >
                    Back to preview
                  </button>
                ) : null}
              </div>
            </header>

            {stage === 'bank' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0c162b] p-6 text-slate-200">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-1.5 text-slate-300 transition hover:border-sky-500 hover:text-white"
                    >
                      Filters
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {uniqueTopics.map((topic) => {
                        const isActive = activeTopicFilter === topic;
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setActiveTopicFilter(isActive ? null : topic)}
                            className={`rounded-full border px-4 py-1.5 transition ${
                              isActive
                                ? 'border-sky-500 bg-sky-500/15 text-white'
                                : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(difficultyLabels) as DifficultyLevel[]).map((difficulty) => {
                        const isActive = activeDifficultyFilter === difficulty;
                        const tone =
                          difficulty === 'easy'
                            ? 'border-emerald-500/60 text-emerald-200'
                            : difficulty === 'hard'
                            ? 'border-rose-500/60 text-rose-200'
                            : 'border-sky-500/60 text-sky-200';
                        return (
                          <button
                            key={difficulty}
                            type="button"
                            onClick={() => setActiveDifficultyFilter(isActive ? null : difficulty)}
                            className={`rounded-full border px-4 py-1.5 transition ${
                              isActive
                                ? `${tone} bg-slate-900/60`
                                : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                            }`}
                          >
                            {difficultyLabels[difficulty]}
                          </button>
                        );
                      })}
                    </div>
                    {(activeTopicFilter || activeDifficultyFilter) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTopicFilter(null);
                          setActiveDifficultyFilter(null);
                        }}
                        className="rounded-full border border-slate-700/70 px-3 py-1.5 text-xs text-slate-300 transition hover:border-sky-500 hover:text-white"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                  <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] px-5 py-3 text-xs text-slate-400">
                    Showing {visibleQuestions.length} of {questionBank.length} questions · {questionCountLabel}
                  </div>
                  <div className="space-y-3">
                    {visibleQuestions.map((question) => {
                      const isSelected = selectedIds.includes(question.id);
                      return (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => toggleQuestionSelection(question.id)}
                          className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                            isSelected
                              ? 'border-sky-500 bg-sky-500/15 shadow-lg shadow-sky-900/40'
                              : 'border-slate-800/80 bg-[#101c33] hover:border-sky-500/70 hover:bg-[#0f1f36]'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold uppercase tracking-[0.25em] ${
                                question.difficulty === 'easy'
                                  ? 'bg-emerald-500/10 text-emerald-200'
                                  : question.difficulty === 'hard'
                                  ? 'bg-rose-500/10 text-rose-200'
                                  : 'bg-sky-500/10 text-sky-200'
                              }`}
                            >
                              {difficultyLabels[question.difficulty]}
                            </span>
                            <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-slate-300">{question.marks} mark{question.marks === 1 ? '' : 's'}</span>
                          </div>
                          <h3 className="mt-3 text-base font-semibold text-white">{question.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{question.prompt}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <aside className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800/70 bg-[#0c162b] p-6 text-sm text-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Right pane</span>
                    <span>{questionCountLabel}</span>
                  </div>
                  {selectedQuestions.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/70 bg-[#101c33] p-6 text-center text-xs text-slate-400">
                      Select questions to start building your test.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedQuestions.map((question, index) => (
                        <div key={question.id} className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-4">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Question {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => toggleQuestionSelection(question.id)}
                              className="text-xs text-sky-400 transition hover:text-sky-300"
                            >
                              Remove
                            </button>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-white">{question.title}</p>
                          <p className="mt-1 text-xs text-slate-400">{question.marks} mark{question.marks === 1 ? '' : 's'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </aside>
              </div>
            ) : null}

            {stage === 'preview' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0c162b] p-6 text-slate-200">
                  <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5 text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="text-white">{selectedQuestions.length} questions · {totalMarksSelected} marks</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {selectedQuestions.map((question, index) => (
                      <div key={question.id} className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-500">Question {index + 1} · {question.marks} mark{question.marks === 1 ? '' : 's'}</p>
                            <h3 className="text-base font-semibold text-white">{question.title}</h3>
                          </div>
                          <span
                            className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${
                              question.difficulty === 'easy'
                                ? 'bg-emerald-500/10 text-emerald-200'
                                : question.difficulty === 'hard'
                                ? 'bg-rose-500/10 text-rose-200'
                                : 'bg-sky-500/10 text-sky-200'
                            }`}
                          >
                            {difficultyLabels[question.difficulty]}
                          </span>
                        </div>
                        {question.imageUrl ? (
                          <div className="overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/80">
                            <img src={question.imageUrl} alt="Question illustration" className="h-48 w-full object-cover" />
                          </div>
                        ) : null}
                        <p className="text-sm leading-6 text-slate-300">{question.prompt}</p>
                        {question.questionType === 'mcq' && question.options ? (
                          <ul className="space-y-2 text-sm text-slate-200">
                            {question.options.map((option) => (
                              <li key={option} className="rounded-xl border border-slate-800/70 bg-[#0f1d34] px-3 py-2">{option}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800/70 bg-[#0c162b] p-6 text-sm text-slate-200">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">PDF settings</p>
                    <div className="flex flex-col gap-2 text-xs">
                      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-800/70 bg-[#101c33] px-4 py-2">
                        <input type="checkbox" checked readOnly className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-sky-500" />
                        Include cover page
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-800/70 bg-[#101c33] px-4 py-2">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-sky-500" />
                        Include revision notes
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-800/70 bg-[#101c33] px-4 py-2">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-sky-500" />
                        Show answers after questions
                      </label>
                    </div>
                  </div>
                  <div className="mt-auto space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <span className="text-emerald-300">Saved</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage('markScheme')}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                    >
                      Download {'->'}
                    </button>
                  </div>
                </aside>
              </div>
            ) : null}

            {stage === 'markScheme' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0c162b] p-6 text-slate-200">
                  <div className="space-y-4">
                    {selectedQuestions.map((question, index) => (
                      <div key={question.id} className="space-y-3 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mark scheme · Question {index + 1}</p>
                            <h3 className="text-base font-semibold text-white">{question.title}</h3>
                            <p className="mt-1 text-xs text-slate-400">{question.marks} mark{question.marks === 1 ? '' : 's'}</p>
                          </div>
                          <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-xs text-slate-300">{difficultyLabels[question.difficulty]}</span>
                        </div>
                        <p className="text-sm leading-6 text-slate-300">{question.prompt}</p>
                        <ul className="space-y-2 text-sm text-slate-200">
                          {question.markScheme.map((line) => (
                            <li key={line} className="rounded-xl border border-slate-800/70 bg-[#0f1d34] px-3 py-2">{line}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="flex h-full flex-col gap-4 rounded-3xl border border-slate-800/70 bg-[#0c162b] p-6 text-sm text-slate-200">
                  <div className="rounded-2xl border border-slate-800/70 bg-[#101c33] p-5 text-xs text-slate-300">
                    <p className="font-semibold text-white">Download mark scheme</p>
                    <p className="mt-2 text-slate-400">Choose the format that best suits your class. Mark schemes open in a new tab ready for printing.</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
                      >
                        Questions PDF
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-400"
                      >
                        Mark scheme PDF
                      </button>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-col gap-2 text-xs text-slate-400">
                    <span>Need to tweak the test?</span>
                    <button
                      type="button"
                      onClick={() => setStage('bank')}
                      className="inline-flex items-center gap-2 text-sky-400 transition hover:text-sky-300"
                    >
                      Return to question bank
                    </button>
                  </div>
                </aside>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
};
