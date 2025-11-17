import { memo } from 'react';

const footerColumns = [
  {
    title: 'Resources',
    links: ['Learning Hub', 'Ambassadors', 'Scholarship', 'Join', 'Past Papers', 'Solution Banks', 'Sitemap'],
  },
  {
    title: 'Members',
    links: ['Launchpad', 'Account', 'Log out'],
  },
  {
    title: 'Company',
    links: ['About us', 'Exam Specificity', 'Content Quality', 'Promotions', 'Jobs', 'Terms', 'Privacy', 'Cookie Policy', 'Help and Support'],
  },
  {
    title: 'Subjects',
    links: ['Biology', 'Chemistry', 'Physics', 'Maths', 'Geography', 'English Literature', 'Psychology', 'All Subjects'],
  },
];

const socialIcons = [
  { name: 'YouTube', label: 'YouTube', href: '#' },
  { name: 'Instagram', label: 'Instagram', href: '#' },
  { name: 'Facebook', label: 'Facebook', href: '#' },
  { name: 'TikTok', label: 'TikTok', href: '#' },
];

const SocialIcon = ({ label }: { label: string }) => (
  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-soft text-xs font-semibold text-muted transition hover:border-accent hover:text-white">
    {label.slice(0, 1)}
  </span>
);

const FooterComponent = () => (
  <footer className="mt-16 border-t border-border bg-[var(--color-bg)] sm:mt-20">
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
      <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-5">
        <div className="space-y-5 text-sm text-muted">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-info)] text-white shadow-lg shadow-[rgba(249,115,22,0.28)]">
            <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M13.5 3L6 13h5l-.5 8 7.5-10h-5z" />
            </svg>
          </div>
          <p>Copyright 2015-2025 Save My Exams Ltd. All Rights Reserved.</p>
          <p className="text-xs text-muted">
            IBO was not involved in the production of, and does not endorse, the resources created by Save My Exams.
          </p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-3 text-sm">
            <h3 className="font-semibold text-white">{column.title}</h3>
            <ul className="space-y-2 text-muted">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
  <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-muted sm:mt-12 sm:justify-start">
        {socialIcons.map((item) => (
          <a key={item.name} aria-label={item.label} href={item.href}>
            <SocialIcon label={item.label} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export const Footer = memo(FooterComponent);
