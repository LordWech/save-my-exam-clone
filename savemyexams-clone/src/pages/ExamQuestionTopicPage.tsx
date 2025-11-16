import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { findResourceContext } from '../data/resources';
import { buildExamSections, findExamSection, findExamTopic, type ExamTopicSection } from '../utils/examQuestions';

const difficulties = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
] as const;

const questionTypes = [
  { id: 'mcq', label: 'Multiple Choice Questions' },
  { id: 'structured', label: 'Structured Questions' },
] as const;

const selfAssessmentOptions = [
  { id: 'correct', label: 'Nailed it', symbol: '✓' },
  { id: 'incorrect', label: 'Needs work', symbol: '✕' },
  { id: 'review', label: 'Flag for review', symbol: '⚑' },
] as const;

type SelfAssessmentValue = (typeof selfAssessmentOptions)[number]['id'];

interface StructuredQuestionPart {
  id: string;
  label: string;
  prompt: string;
  marks: number;
  explanation: string;
  hint?: string;
}

interface SampleQuestion {
  id: string;
  difficulty: (typeof difficulties)[number]['id'];
  prompt: string;
  marks: number;
  explanation?: string;
  options?: string[];
  answerIndex?: number;
  hint?: string;
  parts?: StructuredQuestionPart[];
}

type QuestionType = (typeof questionTypes)[number]['id'];

const createSampleQuestions = (topicTitle: string, questionType: QuestionType) => {
  const baseStem = topicTitle.toLowerCase();

  if (questionType === 'structured') {
    const buildStructuredQuestion = (
      id: string,
      difficulty: (typeof difficulties)[number]['id'],
      prompt: string,
      parts: StructuredQuestionPart[],
      overview?: string,
    ): SampleQuestion => ({
      id,
      difficulty,
      prompt,
      parts,
      marks: parts.reduce((total, part) => total + part.marks, 0),
      explanation: overview,
    });

    const structured: Record<(typeof difficulties)[number]['id'], SampleQuestion[]> = {
      easy: [
        buildStructuredQuestion(
          'structured-easy-1',
          'easy',
          `Warm-up definitions for ${baseStem}.`,
          [
            {
              id: 'structured-easy-1a',
              label: '1a',
              prompt: 'Explain what is meant by a physical quantity.',
              marks: 3,
              explanation: 'A physical quantity can be measured and expressed as a numerical value multiplied by a unit.',
            },
            {
              id: 'structured-easy-1b',
              label: '1b',
              prompt: 'State two base quantities relevant to this topic.',
              marks: 2,
              explanation: 'Any two from length, mass, time, electric current, temperature, amount of substance, luminous intensity.',
            },
            {
              id: 'structured-easy-1c',
              label: '1c',
              prompt: 'Describe the difference between scalar and vector quantities, giving one example of each.',
              marks: 2,
              explanation: 'Scalars have magnitude only (for example, speed). Vectors have magnitude and direction (for example, velocity).',
            },
          ],
          'Check core definitions before diving into past-paper style tasks.',
        ),
        buildStructuredQuestion(
          'structured-easy-2',
          'easy',
          `Measurement skills applied to ${baseStem}.`,
          [
            {
              id: 'structured-easy-2a',
              label: '2a',
              prompt: 'Outline how you would measure the diameter of a wire accurately using digital callipers.',
              marks: 3,
              explanation: 'Close the jaws gently around the wire, rotate and measure at several positions, average the readings, and subtract any zero error.',
              hint: 'Mention how you look for zero error.',
            },
            {
              id: 'structured-easy-2b',
              label: '2b',
              prompt: 'Explain why repeating measurements and averaging improves reliability.',
              marks: 3,
              explanation: 'Repeats reduce the effect of random error and help identify anomalies before averaging for a best estimate.',
            },
          ],
        ),
        buildStructuredQuestion(
          'structured-easy-3',
          'easy',
          `Quick calculations that reinforce ${baseStem} ideas.`,
          [
            {
              id: 'structured-easy-3a',
              label: '3a',
              prompt: 'A student walks 24 m north then 7 m east. State the displacement magnitude to the nearest metre.',
              marks: 2,
              explanation: 'Use Pythagoras: sqrt(24^2 + 7^2) approx. 25 m.',
            },
            {
              id: 'structured-easy-3b',
              label: '3b',
              prompt: 'Comment on whether speed and velocity are the same for the journey.',
              marks: 2,
              explanation: 'Speed considers total distance (31 m) while velocity uses displacement (25 m) with direction, so they differ.',
            },
            {
              id: 'structured-easy-3c',
              label: '3c',
              prompt: 'Suggest one reason the measured displacement could be smaller than the calculated value.',
              marks: 2,
              explanation: 'Measurement uncertainty or the path not being straight could reduce the measured displacement.',
            },
          ],
        ),
      ],
      medium: [
        buildStructuredQuestion(
          'structured-medium-1',
          'medium',
          `Experimental planning for ${baseStem}.`,
          [
            {
              id: 'structured-medium-1a',
              label: '1a',
              prompt: 'Describe how to use a pair of light gates to determine the average speed of a trolley down a ramp.',
              marks: 4,
              explanation: 'Measure the separation of the gates, record the time between beam breaks, calculate speed = distance / time, repeat and average.',
              hint: 'Include measurement of distance between gates.',
            },
            {
              id: 'structured-medium-1b',
              label: '1b',
              prompt: 'Explain one improvement that reduces the effect of random error in the timing.',
              marks: 3,
              explanation: 'Take multiple runs and average or use longer separation so percentage timing uncertainty decreases.',
            },
          ],
        ),
        buildStructuredQuestion(
          'structured-medium-2',
          'medium',
          `Data handling linked to ${baseStem}.`,
          [
            {
              id: 'structured-medium-2a',
              label: '2a',
              prompt: 'A student gathers displacement-time data. Explain how plotting velocity-time reveals constant acceleration.',
              marks: 4,
              explanation: 'Calculate velocities between intervals, plot velocity vs time, and look for a straight line with constant gradient.',
            },
            {
              id: 'structured-medium-2b',
              label: '2b',
              prompt: 'State what feature of the velocity-time graph confirms constant acceleration.',
              marks: 2,
              explanation: 'A straight line of constant gradient (non-zero slope) indicates constant acceleration.',
            },
            {
              id: 'structured-medium-2c',
              label: '2c',
              prompt: 'Suggest one possible reason the plotted points may deviate from a perfect line.',
              marks: 2,
              explanation: 'Timing or distance measurement uncertainties introduce scatter around the theoretical line.',
            },
          ],
        ),
        buildStructuredQuestion(
          'structured-medium-3',
          'medium',
          `Applying equations of motion within ${baseStem}.`,
          [
            {
              id: 'structured-medium-3a',
              label: '3a',
              prompt: 'A ball is thrown upwards at 12 m s^-1. Calculate the time taken to reach maximum height.',
              marks: 3,
              explanation: 'Use v = u + at with v = 0, a = -9.8 m s^-2 giving t approx. 1.2 s.',
            },
            {
              id: 'structured-medium-3b',
              label: '3b',
              prompt: 'Determine the maximum height reached.',
              marks: 3,
              explanation: 'Use v^2 = u^2 + 2as giving s approx. 7.3 m.',
            },
            {
              id: 'structured-medium-3c',
              label: '3c',
              prompt: 'Suggest one source of systematic error if the experiment is repeated indoors.',
              marks: 2,
              explanation: 'Reaction time when starting or stopping a manual timer could bias the measured values.',
            },
          ],
        ),
      ],
      hard: [
        buildStructuredQuestion(
          'structured-hard-1',
          'hard',
          `Derivations and analysis rooted in ${baseStem}.`,
          [
            {
              id: 'structured-hard-1a',
              label: '1a',
              prompt: 'Derive an expression for displacement when initial velocity is u and acceleration is a over time t.',
              marks: 4,
              explanation: 'Start from average velocity = (u + v)/2 with v = u + at to obtain s = ut + 0.5at^2.',
            },
            {
              id: 'structured-hard-1b',
              label: '1b',
              prompt: 'Explain physically why the expression includes both ut and at^2 terms.',
              marks: 3,
              explanation: 'ut accounts for motion if speed stayed at u; the at^2 term adds extra displacement from changing speed.',
            },
            {
              id: 'structured-hard-1c',
              label: '1c',
              prompt: 'State one assumption made during the derivation.',
              marks: 2,
              explanation: 'Acceleration is constant and motion is in a straight line.',
            },
          ],
        ),
        buildStructuredQuestion(
          'structured-hard-2',
          'hard',
          `Investigating uncertainties tied to ${baseStem}.`,
          [
            {
              id: 'structured-hard-2a',
              label: '2a',
              prompt: 'Explain how a systematic error might arise in a ticker-tape timing experiment.',
              marks: 3,
              explanation: 'If the ticker timer frequency is miscalibrated or the tape drags, every timing is offset by the same amount.',
            },
            {
              id: 'structured-hard-2b',
              label: '2b',
              prompt: 'Suggest a method to detect or minimise the systematic error.',
              marks: 3,
              explanation: 'Calibrate against a known timing device or swap to electronic light gates for verification.',
            },
            {
              id: 'structured-hard-2c',
              label: '2c',
              prompt: 'Discuss how the error would appear on a velocity-time graph.',
              marks: 2,
              explanation: 'Points would shift consistently, such as all timings being longer and giving a shallower gradient than expected.',
            },
          ],
        ),
        buildStructuredQuestion(
          'structured-hard-3',
          'hard',
          `Multi-step calculations in ${baseStem}.`,
          [
            {
              id: 'structured-hard-3a',
              label: '3a',
              prompt: 'A car accelerates from rest to 20 m s^-1 in 8 s, cruises for 12 s, then decelerates uniformly to rest in 6 s. Sketch the velocity-time graph.',
              marks: 3,
              explanation: 'Draw a trapezium with linear rise to 20 m s^-1, constant section, then linear fall back to zero.',
            },
            {
              id: 'structured-hard-3b',
              label: '3b',
              prompt: 'Calculate the total distance travelled.',
              marks: 3,
              explanation: 'Use areas: 0.5*20*8 + 20*12 + 0.5*20*6 = 380 m.',
            },
            {
              id: 'structured-hard-3c',
              label: '3c',
              prompt: 'Explain how you could estimate the car\'s average speed from the graph without calculation.',
              marks: 2,
              explanation: 'Average speed equals total area divided by time; visually compare to rectangle of equal area to infer the mean height.',
            },
          ],
        ),
      ],
    };
    return structured;
  }

  const questionSets: Record<(typeof difficulties)[number]['id'], SampleQuestion[]> = {
    easy: [
      {
        id: 'easy-1',
        difficulty: 'easy',
        prompt: `A graph for ${baseStem} shows a straight line with a constant gradient. What does this tell you about the motion?`,
        options: ['The object is stationary', 'The object moves at a constant speed', 'The object is accelerating', 'The object moves backwards'],
        answerIndex: 1,
        marks: 1,
        explanation: 'A straight line on a distance-time graph indicates constant speed. The gradient represents the speed.',
        hint: 'Think about what the gradient of a distance-time graph represents.',
      },
      {
        id: 'easy-2',
        difficulty: 'easy',
        prompt: `Which unit is most appropriate for measuring quantities in ${baseStem}?`,
        options: ['Newton', 'Metre per second', 'Joule', 'Watt'],
        answerIndex: 1,
        marks: 1,
        explanation: 'Speed is measured in metres per second (m s⁻¹) for most mechanics questions.',
      },
      {
        id: 'easy-3',
        difficulty: 'easy',
        prompt: `An object covers 20 m in 5 s. What is its average speed during this ${baseStem} scenario?`,
        options: ['2 m s⁻¹', '4 m s⁻¹', '5 m s⁻¹', '25 m s⁻¹'],
        answerIndex: 1,
        marks: 1,
        explanation: 'Average speed = distance ÷ time = 20 ÷ 5 = 4 m s⁻¹.',
      },
      {
        id: 'easy-4',
        difficulty: 'easy',
        prompt: `Which statement describes constant velocity in the context of ${baseStem}?`,
        options: [
          'Speed and direction both stay the same',
          'Only the speed stays the same',
          'Only the direction stays the same',
          'The object is at rest',
        ],
        answerIndex: 0,
        marks: 1,
        explanation: 'Velocity is a vector quantity; both magnitude and direction must remain constant.',
      },
      {
        id: 'easy-5',
        difficulty: 'easy',
        prompt: `A distance-time graph for ${baseStem} includes a flat horizontal section. What does this represent?`,
        options: ['Increasing speed', 'Decreasing speed', 'Object stationary', 'Changing direction'],
        answerIndex: 2,
        marks: 1,
        explanation: 'A horizontal section shows no change in distance, so the object is stationary.',
      },
    ],
    medium: [
      {
        id: 'medium-1',
        difficulty: 'medium',
        prompt: `During a ${baseStem} investigation a trolley accelerates uniformly from rest to 6 m s⁻¹ in 4 s. What is its acceleration?`,
        options: ['0.5 m s⁻²', '1.0 m s⁻²', '1.5 m s⁻²', '2.0 m s⁻²'],
        answerIndex: 3,
        marks: 2,
        explanation: 'Acceleration = change in velocity ÷ time = (6 − 0) ÷ 4 = 1.5 m s⁻².',
      },
      {
        id: 'medium-2',
        difficulty: 'medium',
        prompt: `A student sketches a velocity-time graph for ${baseStem}. Which area under the graph represents the distance travelled?`,
        options: ['The first second only', 'The entire area under the line', 'Only the triangular region', 'None of the area'],
        answerIndex: 1,
        marks: 2,
        explanation: 'The area under a velocity-time graph equals the distance travelled.',
        hint: 'Velocity-time graphs behave like displacement-time integrals.',
      },
      {
        id: 'medium-3',
        difficulty: 'medium',
        prompt: `An object moving in ${baseStem} covers 50 m in the first 4 s and 30 m in the next 4 s. What happens to its speed?`,
        options: ['It increases', 'It decreases', 'It stays constant', 'It reverses direction'],
        answerIndex: 1,
        marks: 2,
        explanation: 'Speed falls from 12.5 m s⁻¹ to 7.5 m s⁻¹, so it decreases.',
      },
      {
        id: 'medium-4',
        difficulty: 'medium',
        prompt: `Which statement best explains terminal velocity in ${baseStem}?`,
        options: [
          'The resultant force becomes zero when drag equals weight',
          'The object stops moving entirely',
          'Only gravitational force acts on the object',
          'The object changes direction repeatedly',
        ],
        answerIndex: 0,
        marks: 2,
        explanation: 'At terminal velocity the resistive force balances weight, so acceleration is zero.',
      },
      {
        id: 'medium-5',
        difficulty: 'medium',
        prompt: `A distance-time graph for ${baseStem} curves upwards. Which quantity is increasing?`,
        options: ['Distance', 'Speed', 'Acceleration', 'Force'],
        answerIndex: 1,
        marks: 2,
        explanation: 'A steeper gradient over time means the speed is increasing.',
      },
    ],
    hard: [
      {
        id: 'hard-1',
        difficulty: 'hard',
        prompt: `During a ${baseStem} experiment, a trolley accelerates down a ramp. Drawn from data, the velocity-time graph forms a trapezium. How would you calculate the total distance travelled?`,
        options: [
          'Multiply the peak velocity by the total time only',
          'Calculate the area of the trapezium under the graph',
          'Differentiate the velocity-time graph',
          'Take half the product of maximum velocity and time',
        ],
        answerIndex: 1,
        marks: 3,
        explanation: 'Distance equals the area under the velocity-time graph. For a trapezium, use 1/2(a + b)h.',
      },
      {
        id: 'hard-2',
        difficulty: 'hard',
        prompt: `A ${baseStem} question states: a car decelerates from 28 m s⁻¹ to rest in 3.5 s. What distance does it travel during this time?`,
        options: ['14 m', '28 m', '49 m', '84 m'],
        answerIndex: 3,
        marks: 3,
        explanation: 'Use s = (u + v)/2 × t = (28 + 0)/2 × 3.5 = 49 m. Check units.',
      },
      {
        id: 'hard-3',
        difficulty: 'hard',
        prompt: `Explain why terminal velocity for a skydiver (context of ${baseStem}) is eventually reached during free fall.`,
        options: [
          'Air resistance decreases over time',
          'Weight becomes zero at high speed',
          'Drag increases until it balances weight',
          'Gravity increases with speed',
        ],
        answerIndex: 2,
        marks: 3,
        explanation: 'Drag force increases with speed until it equals weight; resultant force becomes zero so acceleration stops.',
      },
      {
        id: 'hard-4',
        difficulty: 'hard',
        prompt: `In ${baseStem} a cyclist accelerates uniformly from 5 to 11 m s⁻¹ over 60 m. What is the acceleration?`,
        options: ['0.3 m s⁻²', '0.6 m s⁻²', '1.2 m s⁻²', '2.0 m s⁻²'],
        answerIndex: 1,
        marks: 3,
        explanation: 'Use v² = u² + 2as → a = (11² − 5²) / (2 × 60) = 0.6 m s⁻².',
      },
      {
        id: 'hard-5',
        difficulty: 'hard',
        prompt: `A velocity-time graph for ${baseStem} includes multiple segments. Describe how you would calculate the displacement between 12 s and 18 s.`,
        options: [
          'Take the gradient of the graph at 12 s',
          'Subtract the velocities at 18 s and 12 s',
          'Integrate (find the area) between the graph and time axis for that interval',
          'Differentiate the area under the graph',
        ],
        answerIndex: 2,
        marks: 3,
        explanation: 'Integrating velocity with respect to time (area under the curve) gives displacement for the interval.',
      },
    ],
  };

  return questionSets;
};

export const ExamQuestionTopicPage = () => {
  const params = useParams<{
    levelSlug: string;
    subjectSlug: string;
    boardSlug: string;
    sectionSlug: string;
    topicSlug: string;
    questionType?: string;
  }>();

  const context = params.levelSlug && params.subjectSlug && params.boardSlug
    ? findResourceContext(params.levelSlug, params.subjectSlug, params.boardSlug)
    : null;

  const sections = useMemo(() => (context ? buildExamSections(context) : []), [context]);
  const activeSection = params.sectionSlug ? findExamSection(sections, params.sectionSlug) : undefined;
  const activeTopic = params.topicSlug ? findExamTopic(activeSection, params.topicSlug) : undefined;

  const firstSection = sections[0];
  const firstTopic = firstSection?.cards[0];

  const activeQuestionType: QuestionType = params.questionType === 'structured' ? 'structured' : 'mcq';

  const questionSets = useMemo(() => {
    if (!activeTopic) {
      return {
        easy: [],
        medium: [],
        hard: [],
      } as Record<(typeof difficulties)[number]['id'], SampleQuestion[]>;
    }
    return createSampleQuestions(activeTopic.title, activeQuestionType);
  }, [activeTopic, activeQuestionType]);
  const activeTypeMeta = questionTypes.find((type) => type.id === activeQuestionType) ?? questionTypes[0];
  const [activeDifficulty, setActiveDifficulty] = useState<(typeof difficulties)[number]['id']>(difficulties[0].id);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [selfAssessment, setSelfAssessment] = useState<Record<string, SelfAssessmentValue | null>>({});

  const questionsForDifficulty = questionSets[activeDifficulty];
  const hasQuestions = questionsForDifficulty && questionsForDifficulty.length > 0;
  const currentQuestion = hasQuestions ? questionsForDifficulty[Math.min(activeQuestionIndex, questionsForDifficulty.length - 1)] : null;

  const redirectPath = !context
    ? '/not-found'
    : !activeSection || !activeTopic
      ? firstSection && firstTopic
        ? `/resources/${context!.level.slug}/${context!.subject.slug}/${context!.board.slug}/exam-questions/${firstSection.slug}/${firstTopic.slug}`
        : '/not-found'
      : null;

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  const { level, subject, board } = context;

  const handleSelectDifficulty = (difficulty: (typeof difficulties)[number]['id']) => {
    setActiveDifficulty(difficulty);
    setActiveQuestionIndex(0);
  };

  const handleSelectQuestion = (index: number) => {
    setActiveQuestionIndex(index);
  };

  const handleToggleReveal = (questionId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSelfAssessment = (partId: string, value: SelfAssessmentValue) => {
    setSelfAssessment((prev) => ({
      ...prev,
      [partId]: prev[partId] === value ? null : value,
    }));
  };

  const handleRevealAll = () => {
    if (!questionsForDifficulty) {
      return;
    }
    setRevealedAnswers((prev) => {
      const updates: Record<string, boolean> = { ...prev };
      for (const question of questionsForDifficulty) {
        if (question.parts && question.parts.length > 0) {
          for (const part of question.parts) {
            updates[part.id] = true;
          }
        } else {
          updates[question.id] = true;
        }
      }
      return updates;
    });
  };

  return (
    <SiteLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-72">
          <div className="sticky top-24 space-y-6 rounded-3xl border border-slate-800/70 bg-[#0a131f] p-5 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Exam Questions</span>
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/exam-questions`}
                className="text-xs text-sky-400 transition hover:text-sky-300"
              >
                Overview
              </Link>
            </div>
            <nav className="space-y-3">
              {sections.map((section: ExamTopicSection) => (
                <div key={section.id} className="rounded-2xl border border-slate-800/70 bg-[#0d1829]">
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-semibold transition ${
                      section.slug === activeSection.slug ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    <span>{section.title}</span>
                    <span className="text-slate-500">{section.cards.length} topics</span>
                  </button>
                  <ul className="border-t border-slate-800/70 text-xs">
                    {section.cards.map((topic) => {
                      const isActiveTopic = topic.slug === activeTopic.slug;
                      const topicBasePath = `/resources/${level.slug}/${subject.slug}/${board.slug}/exam-questions/${section.slug}/${topic.slug}`;

                      return (
                        <li key={topic.slug} className="border-b border-slate-800/60 last:border-b-0">
                          <div
                            className={`flex items-center justify-between px-4 py-3 text-xs font-semibold ${
                              isActiveTopic ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            <span>{topic.title}</span>
                            <span className="text-slate-500">{topic.questionCount} qs</span>
                          </div>
                          <ul className="space-y-1 bg-[#0b1728] px-2 pb-3">
                            {questionTypes.map((type) => {
                              const typePath = type.id === 'mcq' ? topicBasePath : `${topicBasePath}/${type.id}`;
                              const isActiveType = isActiveTopic && activeQuestionType === type.id;
                              return (
                                <li key={`${topic.slug}-${type.id}`}>
                                  <Link
                                    to={typePath}
                                    className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${
                                      isActiveType
                                        ? 'bg-slate-800/70 text-white shadow-inner shadow-black/20'
                                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                                  >
                                    <span>{type.label}</span>
                                    <span className="text-slate-600">→</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <div className="space-y-3">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Link to="/" className="transition hover:text-white">
                Launchpad
              </Link>
              <span className="text-slate-600">/</span>
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}/exam-questions`}
                className="transition hover:text-white"
              >
                {board.name} {subject.name}
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200">{activeTopic.title}</span>
            </nav>
            <header className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b1423] p-6 text-slate-200 shadow-lg shadow-black/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-white">{activeTopic.title}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-slate-200">
                      {activeTypeMeta.label}
                    </span>
                    <span className="text-slate-500">
                      {activeQuestionType === 'structured'
                        ? 'Longer, written responses with mark-scheme guidance.'
                        : 'Quick-fire multiple choice practice with instant answers.'}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Work through curated {activeTopic.title.toLowerCase()} exam questions. Tackle easier ones first, then step up to medium and hard to build exam confidence.
                  </p>
                </div>
                <div className="space-y-2 text-right text-xs text-slate-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                    Exam code: {board.examCode ?? '4PH1'}
                  </span>
                  <span className="block">{activeSection.estimatedHours} hours • {activeSection.totalQuestions} questions</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white"
                >
                  Download PDFs <span className="text-slate-500">⌄</span>
                </button>
                <button
                  type="button"
                  onClick={handleRevealAll}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-slate-500 hover:text-white"
                >
                  All answers
                </button>
              </div>
            </header>
          </div>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-800/70 bg-[#0e1c31] p-1 text-xs">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    type="button"
                    onClick={() => handleSelectDifficulty(difficulty.id)}
                    className={`rounded-full px-4 py-2 font-semibold transition ${
                      activeDifficulty === difficulty.id
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {difficulty.label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">{questionsForDifficulty?.length ?? 0} questions</span>
            </div>

            {hasQuestions && currentQuestion ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {questionsForDifficulty.map((question, index) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => handleSelectQuestion(index)}
                      className={`h-9 w-9 rounded-full border px-2 transition ${
                        index === activeQuestionIndex
                          ? 'border-sky-500 bg-sky-500/20 text-white'
                          : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <article className="space-y-5 rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-slate-200">
                  <header className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-300">
                        {activeQuestionIndex + 1}
                      </span>
                      <span>{currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}</span>
                    </div>
                    <span className="text-xs text-slate-500">Difficulty: {activeDifficulty}</span>
                  </header>

                  <div className="space-y-4 text-sm text-slate-200">
                    {currentQuestion.prompt ? <p>{currentQuestion.prompt}</p> : null}
                    {activeQuestionType === 'mcq' ? (
                      <div className="space-y-2">
                        {(currentQuestion.options ?? []).map((option, optionIndex) => {
                          const isCorrect = typeof currentQuestion.answerIndex === 'number' && optionIndex === currentQuestion.answerIndex;
                          const isRevealed = revealedAnswers[currentQuestion.id];
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                isRevealed && isCorrect
                                  ? 'border-emerald-400/80 bg-emerald-500/10 text-white'
                                  : 'border-slate-700/70 text-slate-200 hover:border-sky-500 hover:text-white'
                              }`}
                              disabled
                            >
                              <span className="text-sm">{String.fromCharCode(65 + optionIndex)}. {option}</span>
                              {isRevealed && isCorrect ? <span className="text-xs text-emerald-300">Correct</span> : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : currentQuestion.parts && currentQuestion.parts.length > 0 ? (
                      <div className="space-y-4">
                        {currentQuestion.parts.map((part) => {
                          const isRevealed = revealedAnswers[part.id];
                          const assessment = selfAssessment[part.id] ?? null;
                          return (
                            <section
                              key={part.id}
                              className="space-y-4 rounded-2xl border border-slate-800/70 bg-[#101c33] p-5"
                            >
                              <header className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                    {part.label}
                                  </span>
                                  <span className="uppercase tracking-[0.3em] text-slate-500">Part</span>
                                </div>
                                <span>{part.marks} {part.marks === 1 ? 'mark' : 'marks'}</span>
                              </header>
                              <p className="text-slate-200">{part.prompt}</p>
                              <div className="space-y-4 text-xs text-slate-400">
                                <div className="space-y-2">
                                  <span className="font-semibold text-slate-300">How did you do?</span>
                                  <div className="flex gap-2">
                                    {selfAssessmentOptions.map((option) => (
                                      <button
                                        key={`${part.id}-${option.id}`}
                                        type="button"
                                        onClick={() => handleSelfAssessment(part.id, option.id)}
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-base transition ${
                                          assessment === option.id
                                            ? option.id === 'correct'
                                              ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                                              : option.id === 'incorrect'
                                                ? 'border-rose-400 bg-rose-500/10 text-rose-200'
                                                : 'border-amber-400 bg-amber-500/10 text-amber-200'
                                            : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                                        }`}
                                        title={option.label}
                                      >
                                        {option.symbol}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <Link
                                    to={`/resources/${level.slug}/${subject.slug}/${board.slug}/revision-notes`}
                                    className="text-sky-400 transition hover:text-sky-300"
                                  >
                                    Stuck? View related notes
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleReveal(part.id)}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
                                  >
                                    {isRevealed ? 'Hide answer' : 'View answer'}
                                  </button>
                                </div>
                                {isRevealed ? (
                                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                                    <p className="font-semibold text-white">Model answer</p>
                                    <p className="mt-2 text-slate-200">{part.explanation}</p>
                                    {part.hint ? (
                                      <p className="mt-2 text-slate-300">Hint: {part.hint}</p>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            </section>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Structured questions coming soon.</p>
                    )}
                    {activeQuestionType === 'mcq' ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleToggleReveal(currentQuestion.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 font-semibold transition hover:border-sky-500 hover:text-white"
                        >
                          {revealedAnswers[currentQuestion.id] ? 'Hide answer' : 'View answer'}
                        </button>
                        <Link
                          to={`/resources/${level.slug}/${subject.slug}/${board.slug}/revision-notes`}
                          className="text-sky-400 transition hover:text-sky-300"
                        >
                          Stuck? View related notes
                        </Link>
                      </div>
                    ) : null}
                    {activeQuestionType === 'mcq' && revealedAnswers[currentQuestion.id] ? (
                      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                        <p className="font-semibold text-white">
                          Answer:
                          {typeof currentQuestion.answerIndex === 'number'
                            ? ` ${String.fromCharCode(65 + currentQuestion.answerIndex)}`
                            : ''}
                        </p>
                        {currentQuestion.explanation ? (
                          <p className="mt-2 text-slate-200">{currentQuestion.explanation}</p>
                        ) : null}
                        {currentQuestion.hint ? (
                          <p className="mt-2 text-slate-300">Hint: {currentQuestion.hint}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-sm text-slate-300">
                Questions for this difficulty are coming soon.
              </div>
            )}
          </section>
        </main>
      </div>
    </SiteLayout>
  );
};
