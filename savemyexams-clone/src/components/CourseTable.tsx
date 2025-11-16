import type { Course } from '../types/course';

interface CourseTableProps {
  courses: Course[];
}

const headerClass = 'px-6 py-4 text-left text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-400';

const ArrowIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
  >
    <path d="M4 10h8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 6l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ActionLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="inline-flex items-center gap-2 rounded-full border border-slate-700/40 bg-slate-900/40 px-4 py-2 text-xs font-medium text-sky-300 transition hover:border-sky-500/60 hover:text-sky-100"
  >
    <span>{label}</span>
    <ArrowIcon />
  </a>
);

export const CourseTable = ({ courses }: CourseTableProps) => (
  <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-[#070d1c]/80 shadow-2xl shadow-black/40 ring-1 ring-white/5">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/70 px-6 py-5">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-white">My courses</p>
        <p className="text-sm text-slate-400">Quickly jump back into the courses you manage.</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
        >
          Edit courses
        </button>
        <button
          type="button"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
        >
          + Add course
        </button>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-800/70 text-sm text-slate-200">
        <thead>
          <tr>
            <th scope="col" className={`${headerClass} w-[24rem]`}>Subject</th>
            <th scope="col" className={headerClass}>Level</th>
            <th scope="col" className={headerClass}>Board</th>
            <th scope="col" className={headerClass}>Revision notes</th>
            <th scope="col" className={headerClass}>Exam questions</th>
            <th scope="col" className={headerClass}>Test builder</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {courses.map((course) => (
            <tr key={course.id} className="transition hover:bg-slate-900/50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-lg shadow-black/30 ${course.badgeColor}`}
                  >
                    {course.badgeLabel}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{course.name}</p>
                    <p className="text-xs text-slate-400">{course.level}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 align-middle text-sm text-slate-300">{course.level}</td>
              <td className="px-6 py-4 align-middle text-sm text-slate-300">{course.board}</td>
              <td className="px-6 py-4 align-middle">
                <ActionLink href={course.revisionUrl} label="Revision Notes" />
              </td>
              <td className="px-6 py-4 align-middle">
                <ActionLink href={course.examQuestionsUrl} label="Exam Questions" />
              </td>
              <td className="px-6 py-4 align-middle">
                <ActionLink href={course.testBuilderUrl} label="Test Builder" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
