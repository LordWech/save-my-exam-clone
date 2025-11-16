import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import {
  resourceTypeLabels,
  type ResourceType,
} from '../data/resources';

const overviewCopy: Record<ResourceType, string> = {
  'revision-notes': 'Concise, exam-board-aligned notes to help students internalise every topic.',
  'exam-questions': 'Topic-tagged question banks complete with mark schemes for targeted practice.',
  'smart-mark': 'AI-assisted marking workflows that highlight misconceptions in seconds.',
  flashcards: 'Interactive flashcards that keep key facts fresh with spaced repetition.',
  'mock-exams': 'Full mock papers that mirror real exam pacing for stress-free preparation.',
  'target-test': 'Quick-fire quizzes personalised to close knowledge gaps fast.',
  'past-papers': 'Historic papers collected in one place with instant feedback and hints.',
  'test-builder': 'Assemble custom assessments in minutes and share them with your classes.',
};

export const ResourceTypePage = () => {
  const navigate = useNavigate();
  const params = useParams<{ resourceType: string }>();

  const resourceType = params.resourceType as ResourceType | undefined;

  const isValidType = useMemo(
    () => (resourceType ? Boolean(resourceTypeLabels[resourceType as ResourceType]) : false),
    [resourceType],
  );

  if (!resourceType || !isValidType) {
    return <Navigate to="/not-found" replace />;
  }

  const safeType = resourceType as ResourceType;
  const title = resourceTypeLabels[safeType];
  const description = overviewCopy[safeType];

  return (
    <SiteLayout>
      <div className="space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</p>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
        </header>

        <section className="space-y-6 rounded-3xl border border-slate-800/70 bg-[#0a1328] px-8 py-10 text-slate-200">
          <h2 className="text-lg font-semibold text-white">What&apos;s included</h2>
          <ul className="grid gap-4 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li className="rounded-2xl border border-slate-800/70 bg-[#0f192f] px-5 py-4">Exam-board specific content tuned for the latest syllabuses.</li>
            <li className="rounded-2xl border border-slate-800/70 bg-[#0f192f] px-5 py-4">Instant access to worked solutions created by specialist tutors.</li>
            <li className="rounded-2xl border border-slate-800/70 bg-[#0f192f] px-5 py-4">Progress analytics to surface topics that need more practice.</li>
            <li className="rounded-2xl border border-slate-800/70 bg-[#0f192f] px-5 py-4">Downloadable resources you can share directly with students.</li>
          </ul>

          <button
            type="button"
            onClick={() => navigate('/resources/browse')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-500/60 px-6 py-2.5 text-sm font-medium text-white transition hover:border-sky-400 hover:bg-sky-500/10"
          >
            Browse by subject
          </button>
        </section>
      </div>
    </SiteLayout>
  );
};
