import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import type { ResourceContext } from '../data/resources';

interface PaperTypeMeta {
  id: string;
  label: string;
  description: string;
}

interface PastPaperRow {
  id: string;
  paperTitle: string;
  markSchemeTitle: string;
  paperHref: string;
  markSchemeHref: string;
  paperTypeId: string;
}

interface PastPaperSection {
  id: string;
  label: string;
  entries: PastPaperRow[];
}

interface PastPaperCollection {
  id: string;
  label: string;
  description?: string;
  sections: PastPaperSection[];
}

const paperTypes: PaperTypeMeta[] = [
  { id: 'paper-1', label: 'Paper 1', description: 'Multiple choice questions' },
  { id: 'paper-2', label: 'Paper 2', description: 'AS structured questions' },
  { id: 'paper-3', label: 'Paper 3', description: 'Advanced practical skills' },
  { id: 'paper-4', label: 'Paper 4', description: 'A Level structured questions' },
  { id: 'paper-5', label: 'Paper 5', description: 'Planning, analysis and evaluation' },
] as const;

const paperBlueprint = [
  {
    id: 'paper-1',
    paperTitle: 'Paper 1: Multiple Choice',
    markSchemeTitle: 'Paper 1: Multiple Choice',
    description: 'Multiple choice questions',
  },
  {
    id: 'paper-2',
    paperTitle: 'Paper 2: AS Level Structured Questions',
    markSchemeTitle: 'Paper 2: AS Level Structured Questions',
    description: 'AS structured questions',
  },
  {
    id: 'paper-3',
    paperTitle: 'Paper 3: Advanced Practical Skills',
    markSchemeTitle: 'Paper 3: Advanced Practical Skills',
    description: 'Advanced practical skills',
  },
  {
    id: 'paper-4',
    paperTitle: 'Paper 4: A Level Structured Questions',
    markSchemeTitle: 'Paper 4: A Level Structured Questions',
    description: 'A Level structured questions',
  },
  {
    id: 'paper-5',
    paperTitle: 'Paper 5: Planning, Analysis and Evaluation',
    markSchemeTitle: 'Paper 5: Planning, Analysis and Evaluation',
    description: 'Planning, analysis and evaluation',
  },
] as const;

const buildSection = (id: string, prefixLabel: string, codes: string[]): PastPaperSection => ({
  id,
  label: prefixLabel,
  entries: paperBlueprint.map((paper, index) => {
    const code = codes[index] ?? codes[codes.length - 1] ?? '';
    const titlePrefix = prefixLabel.length > 0 ? `${prefixLabel} ` : '';
    const safeCode = code.replace('/', '-');
    return {
      id: `${id}-${paper.id}`,
      paperTitle: `${titlePrefix}${paper.paperTitle} ${code}${code ? ' (QP)' : ''}`.trim(),
      markSchemeTitle: `${titlePrefix}${paper.markSchemeTitle} ${code}${code ? ' (MS)' : ''}`.trim(),
      paperHref: `/assets/papers/${safeCode}-qp.pdf`,
      markSchemeHref: `/assets/papers/${safeCode}-ms.pdf`,
      paperTypeId: paper.id,
    };
  }),
});

const buildPastPaperCollections = (): PastPaperCollection[] => [
  {
    id: 'specimen',
    label: 'Specimen Papers',
    description: 'Sample assessments that introduced the latest specification updates.',
    sections: [
      buildSection('specimen-main', 'Specimen Papers', ['9702/01', '9702/02', '9702/03', '9702/04', '9702/05']),
    ],
  },
  {
    id: '2023',
    label: '2023',
    description: 'Latest full series with worked solutions and mark schemes.',
    sections: [
      buildSection('2023-june', 'June 2023', ['9702/11', '9702/21', '9702/31', '9702/41', '9702/51']),
      buildSection('2023-oct', 'Oct/Nov 2023', ['9702/13', '9702/23', '9702/33', '9702/43', '9702/53']),
    ],
  },
  {
    id: '2022',
    label: '2022',
    description: 'Past exam series arranged with quick access to mark schemes.',
    sections: [
      buildSection('2022-june', 'June 2022', ['9702/12', '9702/22', '9702/32', '9702/42', '9702/52']),
      buildSection('2022-oct', 'Oct/Nov 2022', ['9702/13', '9702/23', '9702/33', '9702/43', '9702/53']),
    ],
  },
  {
    id: '2021',
    label: '2021',
    description: 'Use these to stretch higher-attaining students with legacy questions.',
    sections: [
      buildSection('2021-june', 'June 2021', ['9702/11', '9702/21', '9702/31', '9702/41', '9702/51']),
      buildSection('2021-mar', 'March 2021', ['9702/12', '9702/22', '9702/32', '9702/42', '9702/52']),
    ],
  },
  {
    id: '2020',
    label: '2020',
    sections: [
      buildSection('2020-mock', 'Adapted 2020 Series', ['9702/11', '9702/21', '9702/31', '9702/41', '9702/51']),
    ],
  },
  {
    id: '2019',
    label: '2019',
    sections: [
      buildSection('2019-main', 'Oct/Nov 2019', ['9702/13', '9702/23', '9702/33', '9702/43', '9702/53']),
    ],
  },
  {
    id: '2018',
    label: '2018',
    sections: [
      buildSection('2018-main', 'June 2018', ['9702/11', '9702/21', '9702/31', '9702/41', '9702/51']),
    ],
  },
];

interface PastPapersPageProps {
  context: ResourceContext;
}

export const PastPapersPage = ({ context }: PastPapersPageProps) => {
  const { level, subject, board } = context;

  const collections = useMemo(() => buildPastPaperCollections(), []);
  const [activeCollectionId, setActiveCollectionId] = useState(() => collections[0]?.id ?? '');
  const [activePaperTypeId, setActivePaperTypeId] = useState(() => paperTypes[0]?.id ?? '');

  useEffect(() => {
    if (!collections.length) {
      return;
    }
    const currentExists = collections.some((collection) => collection.id === activeCollectionId);
    if (!currentExists) {
      setActiveCollectionId(collections[0].id);
    }
  }, [collections, activeCollectionId]);

  useEffect(() => {
    if (!paperTypes.length) {
      return;
    }
    const activeExists = paperTypes.some((type) => type.id === activePaperTypeId);
    if (!activeExists) {
      setActivePaperTypeId(paperTypes[0].id);
    }
  }, [activePaperTypeId]);

  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) ?? collections[0];
  const activePaperType = paperTypes.find((type) => type.id === activePaperTypeId) ?? paperTypes[0];

  return (
    <SiteLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64">
          <div className="sticky top-24 space-y-6 rounded-3xl border border-slate-800/70 bg-[#0a131f] p-5 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Past Papers</span>
              <Link
                to={`/resources/${level.slug}/${subject.slug}/${board.slug}`}
                className="text-xs text-sky-400 transition hover:text-sky-300"
              >
                Back to board
              </Link>
            </div>
            <nav className="space-y-2">
              {collections.map((collection) => {
                const isActive = collection.id === activeCollectionId;
                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => setActiveCollectionId(collection.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-semibold transition ${
                      isActive
                        ? 'border-sky-500 bg-sky-500/20 text-white shadow-lg shadow-sky-500/20'
                        : 'border-slate-800/60 text-slate-300 hover:border-sky-500 hover:text-white'
                    }`}
                  >
                    <span>{collection.label}</span>
                    <span className="text-slate-500">→</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-10">
          <div className="space-y-4">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Link to="/" className="transition hover:text-white">
                Launchpad
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200">{board.name}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200">{subject.name}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200">Past Papers</span>
            </nav>

            <header className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b1423] p-6 text-slate-200 shadow-lg shadow-black/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-white">Past Papers</h1>
                  <p className="max-w-2xl text-sm text-slate-300">
                    Browse curated collections of {board.name} {subject.name} past papers and mark schemes. Use the filters to focus on the paper you are teaching today or build custom homework packs in minutes.
                  </p>
                </div>
                <div className="space-y-2 text-right text-xs text-slate-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1">
                    Exam code: {board.examCode ?? '9702'}
                  </span>
                  {activeCollection?.description ? (
                    <span className="block text-slate-500">{activeCollection.description}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                {paperTypes.map((type) => {
                  const isActive = type.id === activePaperTypeId;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setActivePaperTypeId(type.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition ${
                        isActive
                          ? 'border-sky-500 bg-sky-500/20 text-white shadow-lg shadow-sky-500/20'
                          : 'border-slate-700/70 text-slate-300 hover:border-sky-500 hover:text-white'
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </header>
          </div>

          <section className="space-y-8">
            {activeCollection?.sections.map((section) => (
              <article key={section.id} className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0d182d] p-6 text-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-white">{section.label}</h2>
                  <span className="text-xs text-slate-400">{section.entries.length} papers</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="hidden grid-cols-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 md:grid">
                    <span>Exam papers</span>
                    <span>Mark schemes</span>
                  </div>
                  <div className="space-y-3">
                    {section.entries
                      .filter((entry) => entry.paperTypeId === activePaperTypeId)
                      .map((entry) => (
                      <div
                        key={entry.id}
                        className="grid gap-4 rounded-2xl border border-slate-800/70 bg-[#101c33] p-4 text-sm text-slate-200 md:grid-cols-2"
                      >
                        <Link to={entry.paperHref ?? '#'} className="flex items-center justify-between gap-3 transition hover:text-sky-300">
                          <span>{entry.paperTitle}</span>
                          <span className="text-xs text-slate-500">Download</span>
                        </Link>
                        <Link to={entry.markSchemeHref ?? '#'} className="flex items-center justify-between gap-3 transition hover:text-sky-300">
                          <span>{entry.markSchemeTitle}</span>
                          <span className="text-xs text-slate-500">Download</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-800/70 bg-[#0b172a] p-6 text-sm text-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">For teachers</p>
                <p className="max-w-2xl text-slate-300">
                  Generate exam-style tests in a few clicks, tailor the format and difficulty for your class, and share printable PDFs or assign digitally.
                </p>
                <p className="text-xs text-slate-500">Currently viewing {activePaperType?.label}: {activePaperType?.description}.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
              >
                Explore test builder →
              </button>
            </div>
          </section>
        </main>
      </div>
    </SiteLayout>
  );
};
