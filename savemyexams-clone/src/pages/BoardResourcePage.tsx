import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import {
  buildResourcePath,
  findResourceContext,
  resourceTypeLabels,
  type ResourceType,
} from '../data/resources';

const includedFeatures = [
  'Exam specification aligned',
  'Written by teachers and examiners',
  'PDF downloads',
  'Step-by-step marking guide',
  'Topic-specific illustrations',
  'Examiner tips and tricks',
  'Test by topic and difficulty',
];

const resourceDescriptions: Record<ResourceType, string> = {
  'revision-notes': 'Concise, high-quality notes that make complex topics stick.',
  'exam-questions': 'Past paper and exam-style questions with solutions.',
  'smart-mark': 'AI-assisted marking that highlights misconceptions instantly.',
  flashcards: 'Spaced-repetition flashcards to keep key facts fresh.',
  'mock-exams': 'Timed papers that replicate the real exam experience.',
  'target-test': 'Quick quizzes tailored to shore up weak spots fast.',
  'past-papers': 'Every past paper in one place with mark schemes included.',
  'test-builder': 'Create and share bespoke tests in minutes. For teachers.',
};

export const BoardResourcePage = () => {
  const params = useParams<{ levelSlug: string; subjectSlug: string; boardSlug: string }>();

  const context = params.levelSlug && params.subjectSlug && params.boardSlug
    ? findResourceContext(params.levelSlug, params.subjectSlug, params.boardSlug)
    : null;

  if (!context) {
    return <Navigate to="/not-found" replace />;
  }

  const { level, subject, board } = context;

  return (
    <SiteLayout>
      <div className="space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <Link to={`/resources/browse`} className="transition hover:text-white">
              {level.name}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{subject.name}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{board.name}</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{level.name}</p>
            <h1 className="text-3xl font-semibold text-white">{board.name} {subject.name} Revision</h1>
            {board.examCode ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-200">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Exam code: {board.examCode}
              </span>
            ) : null}
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Tools designed specifically for the {board.name} {subject.name} syllabus to help your learners excel,
              including past papers, revision notes, and exam-style questions created by our specialist team.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2 text-[0.7rem] font-medium text-slate-200">
            {includedFeatures.map((feature) => (
              <li key={feature} className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />
                {feature}
              </li>
            ))}
          </ul>
        </header>

        <section className="rounded-3xl border border-slate-800/70 bg-[#0a1328] p-6 text-sm text-slate-200">
          <div className="flex flex-col gap-3 rounded-2xl bg-[#101b33] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">For you</p>
              <h2 className="text-lg font-semibold text-white">Strengths & Weaknesses</h2>
              <p className="mt-1 max-w-md text-xs text-slate-400">
                Understand topic progression based on answered questions. Get instant recommendations on what to revise next.
              </p>
            </div>
            <Link
              to={buildResourcePath(level.slug, subject.slug, board.slug, 'target-test')}
              className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/60 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/10"
            >
              Explore recommendations
            </Link>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Study tools</h2>
            <p className="text-xs text-slate-400">Select a resource to jump straight into the materials you need.</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {board.resources.map((resourceType) => (
              <li key={resourceType}>
                <Link
                  to={buildResourcePath(level.slug, subject.slug, board.slug, resourceType)}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-slate-800/70 bg-[#0d1730] px-6 py-5 text-left transition hover:border-sky-500/70 hover:bg-[#111f3c]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/70 text-xs font-semibold text-slate-200">
                    {resourceTypeLabels[resourceType].split(' ').map((word) => word[0]).join('').slice(0, 2)}
                  </span>
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-base font-semibold text-white">
                      {resourceTypeLabels[resourceType]}
                      {resourceType === 'test-builder' ? (
                        <span className="ml-2 rounded-full border border-amber-500/60 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-amber-300">
                          For teachers
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs leading-5 text-slate-400">{resourceDescriptions[resourceType]}</span>
                    <span className="text-xs font-semibold text-sky-400 opacity-0 transition group-hover:opacity-100">
                      View materials →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteLayout>
  );
};
