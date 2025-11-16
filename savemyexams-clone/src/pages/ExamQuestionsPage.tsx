import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import type { ResourceContext } from '../data/resources';
import { buildExamSections, type ExamTopicSection } from '../utils/examQuestions';

interface ExamQuestionsPageProps {
  context: ResourceContext;
}

export const ExamQuestionsPage = ({ context }: ExamQuestionsPageProps) => {
  const { level, subject, board } = context;
  const sections = useMemo(() => buildExamSections(context), [context]);

  const totalHours = sections.reduce((sum, section) => sum + section.estimatedHours, 0);
  const totalQuestions = sections.reduce((sum, section) => sum + section.totalQuestions, 0);

  return (
    <SiteLayout>
      <div className="space-y-12">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link to={`/resources/type/exam-questions`} className="transition hover:text-white">
            Exam Questions
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{level.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{subject.name}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">{board.name}</span>
        </nav>

        <header className="space-y-5 rounded-3xl border border-slate-800/70 bg-[#0b1423] px-8 py-8 text-slate-200 shadow-lg shadow-black/40">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-lg">📄</span>
              Exam Questions
            </div>
            <h1 className="text-3xl font-semibold text-white">
              {board.name} {subject.name} Exam Questions
            </h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Practise exam-style questions organised by topic with matching mark schemes. Download printable PDFs or work online and track which questions you still need to master before the exam.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
              Exam code: {board.examCode ?? '4PH1'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
              {totalHours} study hours
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
              {totalQuestions} questions
            </span>
          </div>
        </header>

        <section className="space-y-10">
          {sections.map((section: ExamTopicSection) => (
            <div key={section.id} className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-400">
                  {section.estimatedHours} hours
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-400">
                  {section.totalQuestions} questions
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {section.cards.map((card) => (
                  <div
                    key={card.title}
                    className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-slate-800/70 bg-[#0e1a2f] px-6 py-6 text-sm text-slate-200 transition hover:border-sky-500/60 hover:shadow-lg hover:shadow-sky-500/10"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-semibold text-white">{card.title}</p>
                        <span className="text-xs text-slate-500">{card.questionCount} qs</span>
                      </div>
                      <p className="text-xs leading-6 text-slate-400">{card.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
                      >
                        {card.downloadLabel}
                        <span className="text-slate-500">⌄</span>
                      </button>
                      <Link
                        to={`/resources/${level.slug}/${subject.slug}/${board.slug}/exam-questions/${section.slug}/${card.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 transition hover:text-sky-300"
                      >
                        View questions →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </SiteLayout>
  );
};
