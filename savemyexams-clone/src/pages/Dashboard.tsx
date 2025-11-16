import { ProgressCard } from '../components/ProgressCard';
import { CourseTable } from '../components/CourseTable';
import { SiteLayout } from '../layouts/SiteLayout';
import type { Course } from '../types/course';

const courses: Course[] = [
  {
    id: 'physics-igcse',
    name: 'Science (Double Award): Physics',
    level: 'IGCSE',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-amber-400 to-amber-600',
    badgeLabel: 'PH',
  },
  {
    id: 'chemistry-igcse',
    name: 'Science (Double Award): Chemistry',
    level: 'IGCSE',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    badgeLabel: 'CH',
  },
  {
    id: 'biology-igcse',
    name: 'Science (Double Award): Biology',
    level: 'IGCSE',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-lime-400 to-lime-600',
    badgeLabel: 'BI',
  },
  {
    id: 'maths-mechanics',
    name: 'Maths: Mechanics',
    level: 'A Level',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-rose-400 to-rose-600',
    badgeLabel: 'MM',
  },
  {
    id: 'maths-pure',
    name: 'Maths: Pure',
    level: 'A Level',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-600',
    badgeLabel: 'MP',
  },
  {
    id: 'chemistry-al',
    name: 'Chemistry',
    level: 'IGCSE',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
    badgeLabel: 'CH',
  },
  {
    id: 'biology-al',
    name: 'Biology',
    level: 'IGCSE',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-green-400 to-green-600',
    badgeLabel: 'BI',
  },
  {
    id: 'physics-al',
    name: 'Physics',
    level: 'A Level',
    board: 'Cambridge (CIE)',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-sky-400 to-sky-600',
    badgeLabel: 'PH',
  },
  {
    id: 'physics-igcse-2',
    name: 'Physics',
    level: 'IGCSE',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    badgeLabel: 'PH',
  },
  {
    id: 'physics-ial',
    name: 'Physics',
    level: 'International A Level (IAL)',
    board: 'Edexcel',
    revisionUrl: '#',
    examQuestionsUrl: '#',
    testBuilderUrl: '#',
    badgeColor: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    badgeLabel: 'PH',
  },
];

export const DashboardPage = () => (
  <SiteLayout>
    <div className="flex flex-col gap-12">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Pick up where you left off</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Welcome back, Samuel</h1>
          </div>
          <button
            type="button"
            className="hidden rounded-full border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white md:block"
          >
            View analytics
          </button>
        </div>
        <ProgressCard
          courseLabel="Edexcel - A Level"
          moduleLabel="Physics / Working as a Physicist"
          topic="SI Units"
        />
      </section>

      <section className="space-y-4">
        <CourseTable courses={courses} />
      </section>
    </div>
  </SiteLayout>
);
