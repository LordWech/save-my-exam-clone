import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import {
  findResourceContext,
  resourceTypeLabels,
  type ResourceType,
} from '../data/resources';
import { FlashcardsResourcePage } from './FlashcardsResourcePage';
import { ExamQuestionsPage } from './ExamQuestionsPage';
import { PastPapersPage } from './PastPapersPage.tsx';
import { TargetTestPage } from './TargetTestPage.tsx';
import { TestBuilderPage } from './TestBuilderPage.tsx';
import { RevisionNotesPage } from './RevisionNotesPage.tsx';

export const ResourceDetailPage = () => {
  const params = useParams<{
    levelSlug: string;
    subjectSlug: string;
    boardSlug: string;
    resourceType: string;
  }>();

  const context = useMemo(() => {
    if (!params.levelSlug || !params.subjectSlug || !params.boardSlug) {
      return null;
    }

    return findResourceContext(params.levelSlug, params.subjectSlug, params.boardSlug);
  }, [params.levelSlug, params.subjectSlug, params.boardSlug]);

  const resourceType = params.resourceType as ResourceType | undefined;
  const isValidResourceType = resourceType ? Boolean(resourceTypeLabels[resourceType]) : false;

  if (!context || !resourceType || !isValidResourceType) {
    return <Navigate to="/not-found" replace />;
  }

  const { level, subject, board } = context;

  if (resourceType === 'revision-notes') {
    return <RevisionNotesPage context={context} />;
  }
  if (resourceType === 'flashcards') {
    return <FlashcardsResourcePage context={context} />;
  }
  if (resourceType === 'exam-questions') {
    return <ExamQuestionsPage context={context} />;
  }
  if (resourceType === 'past-papers') {
    return <PastPapersPage context={context} />;
  }
  if (resourceType === 'target-test') {
    return <TargetTestPage context={context} />;
  }
  if (resourceType === 'test-builder') {
    return <TestBuilderPage context={context} />;
  }
  const pageTitle = `${board.name} ${resourceTypeLabels[resourceType]} (${subject.name})`;

  return (
    <SiteLayout>
      <div className="space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{level.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{subject.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{resourceTypeLabels[resourceType]}</span>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{level.name}</p>
          <h1 className="text-3xl font-semibold text-white">{pageTitle}</h1>
          {board.examCode ? (
            <p className="text-sm text-slate-400">Exam code: {board.examCode}</p>
          ) : null}
          {board.meta ? (
            <p className="text-sm text-slate-500">{board.meta}</p>
          ) : null}
        </header>

        <section className="space-y-6 rounded-3xl border border-slate-800/70 bg-[#0a1328] px-8 py-10 text-slate-200">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Explore high-quality {resourceTypeLabels[resourceType].toLowerCase()} tailored for the {board.name}{' '}
              syllabus. Every resource is created by specialists and aligned to the latest specification, so you can focus
              on helping students excel.
            </p>
          </div>

          {board.revisionNotes ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Included topics</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {board.revisionNotes.sections.map((section) => (
                  <div key={section.title} className="space-y-2 rounded-2xl border border-slate-800/70 bg-[#0f192f] px-5 py-4">
                    <p className="text-sm font-semibold text-white">{section.title}</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {section.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800/70 bg-[#0f192f] px-5 py-4 text-sm">
            <Link
              to={`/resources/${level.slug}/${subject.slug}/${board.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 transition hover:border-sky-500 hover:text-white"
            >
              View other resources for this board
            </Link>
            <Link
              to="/resources/browse"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 transition hover:border-sky-500 hover:text-white"
            >
              Browse all subjects
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
};
