import type { Course } from '../types/course';

interface CourseTableProps {
  courses: Course[];
}

const headerClass = 'px-6 py-4 text-left text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-muted';

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
    className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent-tint px-4 py-2 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
  >
    <span>{label}</span>
    <ArrowIcon />
  </a>
);

export const CourseTable = ({ courses }: CourseTableProps) => (
  <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/40 ring-1 ring-white/5">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-white">My courses</p>
        <p className="text-sm text-muted">Quickly jump back into the courses you manage.</p>
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto md:justify-start md:gap-3">
        <button
          type="button"
          className="w-full rounded-full border border-border px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-accent hover:text-white sm:w-auto"
        >
          Edit courses
        </button>
        <button
          type="button"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[rgba(249,115,22,0.35)] transition hover:bg-accent-soft"
        >
          + Add course
        </button>
      </div>
    </div>
    <div className="space-y-3 border-b border-border px-4 py-4 md:hidden">
      {courses.map((course) => (
        <div key={course.id} className="space-y-3 rounded-2xl border border-border bg-surface-soft p-4 shadow-sm shadow-black/30">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-lg shadow-black/30 ${course.badgeColor}`}
            >
              {course.badgeLabel}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{course.name}</p>
              <p className="text-xs text-muted">{course.level}</p>
              <p className="text-xs text-muted">{course.board}</p>
            </div>
          </div>
          <div className="grid gap-2">
            <ActionLink href={course.revisionUrl} label="Revision Notes" />
            <ActionLink href={course.examQuestionsUrl} label="Exam Questions" />
            <ActionLink href={course.testBuilderUrl} label="Test Builder" />
          </div>
        </div>
      ))}
    </div>
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full divide-y divide-[var(--color-border)] text-sm text-[var(--color-text)]">
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
        <tbody className="divide-y divide-[var(--color-border)]">
          {courses.map((course) => (
            <tr key={course.id} className="transition hover:bg-surface-muted">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow-lg shadow-black/30 ${course.badgeColor}`}
                  >
                    {course.badgeLabel}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{course.name}</p>
                    <p className="text-xs text-muted">{course.level}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 align-middle text-sm text-muted">{course.level}</td>
              <td className="px-6 py-4 align-middle text-sm text-muted">{course.board}</td>
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
