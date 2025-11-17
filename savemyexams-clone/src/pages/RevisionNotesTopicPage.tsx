import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import { findResourceContext } from '../data/resources';
import { slugify } from '../utils/slug';

type RevisionTopicNavItem = {
  sectionId: string;
  sectionLabel: string;
  sectionSlug: string;
  progress: number;
  topics: Array<{
    id: string;
    label: string;
    slug: string;
    progress: number;
  }>;
};

type TopicContentBlock = {
  heading: string;
  body?: string;
  paragraphs?: string[];
  bullets?: string[];
  groups?: Array<{
    title?: string;
    items: string[];
  }>;
};

type TopicCallout = {
  title: string;
  body: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

type TopicContent = {
  title: string;
  introBullets: string[];
  heroImageUrl?: string;
  heroImageAlt?: string;
  summaryParagraph: string;
  estimationTable?: {
    caption: string;
    rows: Array<{
      label: string;
      value: string;
    }>;
  };
  blocks: TopicContentBlock[];
  examinerTips: string[];
  teacherCallout: TopicCallout;
  studentActions: string[];
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const getSectionProgress = (sectionIndex: number, totalSections: number) => {
  if (totalSections <= 0) {
    return 0;
  }
  const base = 45 + ((totalSections - sectionIndex) / totalSections) * 45;
  return clampPercent(base);
};

const getTopicProgress = (sectionIndex: number, topicIndex: number, topicCount: number) => {
  if (topicCount <= 1) {
    return clampPercent(45 + sectionIndex * 5);
  }
  const ratio = (topicIndex + 1) / topicCount;
  const sectionBias = Math.max(0, 10 - sectionIndex * 1.5);
  return clampPercent(25 + ratio * 55 + sectionBias);
};

const pickProgressColour = (percent: number) => {
  if (percent >= 75) {
    return 'var(--color-success)';
  }
  if (percent >= 55) {
    return 'var(--color-accent)';
  }
  return 'var(--color-warning)';
};

const ProgressRing = ({ percent, size = 40 }: { percent: number; size?: number }) => {
  const clamped = clampPercent(percent);
  const colour = pickProgressColour(clamped);
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(${colour} ${clamped}%, rgba(148, 163, 184, 0.2) ${clamped}%)` }}
      />
      <span className="absolute inset-[5px] rounded-full bg-[#08101d]" />
      <span className="relative text-[10px] font-semibold text-slate-200">{Math.round(clamped)}%</span>
    </span>
  );
};

const mapSections = (contextNav: ReturnType<typeof findResourceContext>): RevisionTopicNavItem[] => {
  if (!contextNav) {
    return [];
  }
  const sections = contextNav.board.revisionNotes?.sections ?? [];
  return sections.map((section, sectionIndex) => ({
    sectionId: slugify(`${contextNav.board.slug}-${section.title || sectionIndex}`),
    sectionLabel: section.title || `Section ${sectionIndex + 1}`,
    sectionSlug: slugify(section.title || `section-${sectionIndex + 1}`),
    progress: getSectionProgress(sectionIndex, sections.length),
    topics: section.topics.map((topic, topicIndex) => ({
      id: slugify(`${contextNav.board.slug}-${topic}-${topicIndex}`),
      label: topic,
      slug: slugify(topic),
      progress: getTopicProgress(sectionIndex, topicIndex, section.topics.length),
    })),
  }));
};

const topicContentMap: Record<string, TopicContent> = {
  'physical-quantities': {
    title: 'Physical Quantities',
    introBullets: [
      'Speed and velocity are examples of physical quantities; both can be measured.',
      'All physical quantities consist of a numerical magnitude and a unit.',
      'Use precise scientific vocabulary when defining each quantity.',
    ],
    heroImageUrl: 'https://images.ctfassets.net/wl95ljfippl8/1Efa7saEHeWtE8YKpLdakc/4bf01d8ea1d2235f2310329af1a806de/singing-bowl.png',
    heroImageAlt: 'Illustration showing physical quantities',
    summaryParagraph:
      'A physical quantity combines a number with a unit. In Cambridge (CIE) A Level Physics you will revisit many familiar quantities, but examiners expect precise language and unit usage. Memorise benchmark values so you can make sensible estimates under timed conditions.',
    estimationTable: {
      caption: 'Useful benchmark values for estimation questions',
      rows: [
        { label: 'Diameter of an atom', value: '1e-10 m' },
        { label: 'Wavelength of UV radiation', value: '10 nm' },
        { label: 'Mass of an adult', value: '70 kg' },
        { label: 'Acceleration due to gravity', value: '9.81 m s^-2' },
        { label: 'Charge of an electron', value: '1.60e-19 C' },
      ],
    },
    blocks: [
      {
        heading: 'Estimating physical quantities',
        paragraphs: [
          'During the exam you may be asked to estimate a value by combining typical measurements. State every assumption clearly and show unit conversions before calculating. When in doubt, round numbers to one significant figure to keep the arithmetic manageable.',
        ],
        bullets: [
          'List the assumptions you make, such as uniform density.',
          'Convert to SI base units before calculating.',
          'Quote your final answer to 1-2 significant figures.',
        ],
      },
      {
        heading: 'Base and derived units',
        paragraphs: [
          'There are seven base SI units. All other quantities are combinations of these. Expressing derived units in base form helps you check algebra and confirm whether an expression is dimensionally consistent.',
        ],
        bullets: [
          'Length (metre, m)',
          'Mass (kilogram, kg)',
          'Time (second, s)',
          'Electric current (ampere, A)',
          'Thermodynamic temperature (kelvin, K)',
          'Amount of substance (mole, mol)',
          'Luminous intensity (candela, cd)',
        ],
      },
      {
        heading: 'Scalar and vector quantities',
        paragraphs: [
          'Scalars have magnitude only, while vectors have both magnitude and direction. Draw vector triangles to combine components and practise resolving vectors along perpendicular axes to avoid sign errors.',
        ],
        bullets: [
          'Represent vector sums graphically before calculating.',
          'Quote directions using bearings or compass points when required.',
          'Remember that work and energy are scalar even when force is a vector.',
        ],
      },
    ],
    examinerTips: [
      'Use the word magnitude when discussing the size of a quantity.',
      'In estimation questions, examiners award marks for method even if the number is slightly off.',
      'Show unit conversions explicitly in multi-step calculations.',
    ],
    teacherCallout: {
      title: 'Teach it with confidence',
      body:
        'Kick off the topic with a practical measuring mass, length, and time. Challenge students to estimate the kinetic energy of a walking student using only the data gathered in class.',
      bullets: [
        'Set a homework task where students justify each assumption they make.',
        'Use exit tickets focusing on identifying base units.',
      ],
      ctaLabel: 'Open Test Builder',
      ctaHref: '#',
    },
    studentActions: [
      'Attempt the quick quiz on physical quantities to reinforce key terms.',
      'Create flashcards listing each SI base unit with its symbol.',
      'Pair up and swap estimation questions to compare reasoning.',
    ],
  },
  'scalars-vectors': {
    title: 'Scalars & Vectors',
    introBullets: [
      'All quantities can be one of two types: a scalar or a vector.',
      'Always quote vectors with both magnitude and direction.',
      'Use sketches to show how vectors combine before you calculate.',
    ],
    heroImageUrl: 'https://images.ctfassets.net/wl95ljfippl8/4gCm6Kk67bbBwm9H5AghKr/d44f91f1eb6d0e0153660066407368c1/vector-distance-map.png',
    heroImageAlt: 'Illustration comparing distance and displacement',
    summaryParagraph:
      'Vectors have both magnitude and direction, whereas scalars have magnitude only. Distinguishing between them allows you to choose the correct mathematical tools and to communicate solutions clearly in the exam.',
    blocks: [
      {
        heading: 'What are scalar & vector quantities?',
        paragraphs: [
          'All quantities studied in physics are either scalar or vector. Scalars are fully described by magnitude alone, while vectors require both magnitude and direction. In your responses, use the words magnitude and direction explicitly when comparing the two.',
        ],
        groups: [
          {
            title: 'Scalars',
            items: [
              'Have magnitude but no direction.',
              'Examples include mass, temperature, speed, energy, and time.',
              'Combine using ordinary arithmetic (e.g. simple addition).',
            ],
          },
          {
            title: 'Vectors',
            items: [
              'Have both magnitude and direction.',
              'Examples include displacement, velocity, acceleration, force, and momentum.',
              'Combine using vector addition, often represented with arrows or component form.',
            ],
          },
        ],
      },
      {
        heading: 'Distance and displacement',
        paragraphs: [
          'Distance is a scalar: it is the total path length travelled, regardless of direction. Displacement is the vector from the starting point to the finishing point, so it includes direction as well as magnitude. Examiners look for explicit comparison statements such as "distance is scalar whereas displacement is vector".',
        ],
        bullets: [
          'Use notation such as d for distance and vector s for displacement to highlight the difference.',
          'When asked to compare, mention magnitude and direction in your answer.',
          'Sketch a simple map to illustrate the difference before calculating.',
        ],
      },
      {
        heading: 'Combining vectors in exams',
        paragraphs: [
          'Draw vectors tip-to-tail or resolve them into perpendicular components. Remember that adding a vector to its negative gives zero, and that components can be negative even when magnitude is positive.',
        ],
        bullets: [
          'Write vector equations before substituting numbers.',
          'Include direction (e.g. bearing or axis) in the final statement.',
          'Check units - displacement should be in metres while distance might be kilometres.',
        ],
      },
    ],
    examinerTips: [
      'If a question uses "state the difference", give two linked statements (one for scalar, one for vector).',
      'Use bold letters or arrow notation for vectors to avoid ambiguity.',
      'Cross-check that your final direction matches the diagram or the sign of components.',
    ],
    teacherCallout: {
      title: 'Bring it to life',
      body:
        'Ask students to walk a route around the classroom while another student tracks displacement on a grid. Use their measurements to discuss why the scalar distance can exceed the vector displacement.',
      bullets: [
        'Provide mini-whiteboards for sketching vector triangles.',
        'Use retrieval questions comparing pairs of quantities and asking students to classify them.',
      ],
      ctaLabel: 'Assign a quick test',
      ctaHref: '#',
    },
    studentActions: [
      'Create a two-column table of ten scalars and ten vectors with definitions.',
      'Practise drawing displacement vectors on graph paper for common journeys.',
      'Attempt exam questions that involve comparing speed and velocity.',
    ],
  },
};

const defaultTopicContent: TopicContent = {
  title: 'Topic overview',
  introBullets: [
    'Structured revision notes summarise key facts.',
    'Work through the example problems to secure mastery.',
    'Use the quick checks at the end to test understanding.',
  ],
  summaryParagraph:
    'We are still adding deep dives for this topic. In the meantime, use the outline below to guide self study and plan retrieval questions.',
  blocks: [
    {
      heading: 'Learning focus',
      paragraphs: ['Break the topic into teachable chunks and revisit them through low-stakes quizzes.'],
    },
  ],
  examinerTips: ['Check the specification statements before final revision.'],
  teacherCallout: {
    title: 'Share feedback',
    body: 'Assign a starter question that surfaces misconceptions and review it in plenary.',
  },
  studentActions: ['Write three questions you would expect to see on this topic.'],
};

export const RevisionNotesTopicPage = () => {
  const params = useParams<{
    levelSlug: string;
    subjectSlug: string;
    boardSlug: string;
    sectionSlug: string;
    topicSlug: string;
  }>();

  const context = useMemo(() => {
    if (!params.levelSlug || !params.subjectSlug || !params.boardSlug) {
      return null;
    }
    return findResourceContext(params.levelSlug, params.subjectSlug, params.boardSlug);
  }, [params.boardSlug, params.levelSlug, params.subjectSlug]);

  const navSections = useMemo(() => mapSections(context), [context]);

  if (!context) {
    return <Navigate to="/not-found" replace />;
  }

  const { level, subject, board } = context;

  const { sectionSlug, topicSlug } = params;

  const flatTopics = navSections.flatMap((section) =>
    section.topics.map((topic) => ({
      section,
      topic,
    })),
  );

  const currentEntry = flatTopics.find((item) => item.section.sectionSlug === sectionSlug && item.topic.slug === topicSlug);

  if (!currentEntry) {
    return <Navigate to="/not-found" replace />;
  }

  const topicContent = topicContentMap[topicSlug ?? ''] ?? defaultTopicContent;
  const currentTopicProgress = currentEntry.topic.progress;
  const currentSectionProgress = currentEntry.section.progress;

  const currentIndex = flatTopics.findIndex((item) => item.section.sectionSlug === sectionSlug && item.topic.slug === topicSlug);
  const previousEntry = currentIndex > 0 ? flatTopics[currentIndex - 1] : null;
  const nextEntry = currentIndex >= 0 && currentIndex < flatTopics.length - 1 ? flatTopics[currentIndex + 1] : null;

  const linkForEntry = (entry: typeof flatTopics[number]) =>
    `/resources/${level.slug}/${subject.slug}/${board.slug}/revision-notes/${entry.section.sectionSlug}/${entry.topic.slug}`;

  return (
    <SiteLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full max-w-xs space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b162a] p-5 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Course</span>
            <Link to={`/resources/${level.slug}/${subject.slug}/${board.slug}/revision-notes`} className="text-xs text-sky-400 transition hover:text-sky-300">
              All notes
            </Link>
          </div>
          <div className="space-y-3">
            {navSections.map((section, sectionIndex) => (
              <div key={section.sectionId} className="rounded-2xl border border-slate-800/70 bg-[#101c33]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  <span className="flex items-center gap-3">
                    <ProgressRing percent={section.progress} size={42} />
                    <span className="flex flex-col text-left">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">{sectionIndex + 1}.</span>
                      <span className="text-sm font-semibold text-white">{section.sectionLabel}</span>
                      <span className="text-[11px] text-slate-500">{section.topics.length} topic{section.topics.length === 1 ? '' : 's'}</span>
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">View</span>
                </button>
                <ul className="border-t border-slate-800/70">
                  {section.topics.map((topic) => {
                    const isActive = topic.slug === topicSlug;
                    return (
                      <li key={topic.id}>
                        <Link
                          to={linkForEntry({ section, topic })}
                          className={`flex items-center justify-between gap-3 px-4 py-2 text-xs transition ${
                            isActive ? 'bg-sky-500/20 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <ProgressRing percent={topic.progress} size={30} />
                            <span className="text-sm">{topic.label}</span>
                          </span>
                          <span className="text-[11px] text-slate-500">{isActive ? 'In progress' : 'Open'}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="transition hover:text-white">
              Launchpad
            </Link>
            <span className="text-slate-600">/</span>
            <Link to={`/resources/${level.slug}/${subject.slug}/${board.slug}`} className="transition hover:text-white">
              {subject.name}
            </Link>
            <span className="text-slate-600">/</span>
            <Link to={`/resources/${level.slug}/${subject.slug}/${board.slug}/revision-notes`} className="transition hover:text-white">
              Revision Notes
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{topicContent.title}</span>
          </nav>

          <header className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b172a] p-8 text-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-white">{topicContent.title}</h1>
                {board.examCode ? (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-300">
                    Exam code: {board.examCode}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>Written by: Dan Mitchell-Bennet</span>
                  <span>Reviewed by: Caroline Carroll</span>
                  <span>Updated on: 24 December 2024</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-[#101c33] px-4 py-2 text-left">
                  <ProgressRing percent={currentTopicProgress} size={50} />
                  <div className="text-xs text-slate-300">
                    <p className="uppercase tracking-[0.3em] text-slate-500">Topic progress</p>
                    <p className="text-sm text-slate-200">Keep revising to push mastery higher.</p>
                    <p className="mt-1 text-[11px] text-slate-500">Section average: {Math.round(currentSectionProgress)}%</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Download PDF
                </button>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {topicContent.introBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </header>

          <section className="space-y-6">
            {topicContent.heroImageUrl ? (
              <div className="rounded-3xl border border-slate-800/70 bg-[#0b172a] p-6">
                <img
                  src={topicContent.heroImageUrl}
                  alt={topicContent.heroImageAlt ?? 'Topic illustration'}
                  className="mx-auto max-h-64 w-full rounded-2xl object-cover"
                />
              </div>
            ) : null}

            <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-[#0b172a] p-8 text-sm text-slate-200">
              <p className="leading-6 text-slate-300">{topicContent.summaryParagraph}</p>
            </div>

            {topicContent.estimationTable ? (
              <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-[#0b172a]">
                <div className="border-b border-slate-800/70 px-6 py-4 text-sm font-semibold text-white">
                  {topicContent.estimationTable.caption}
                </div>
                <table className="w-full text-left text-sm text-slate-200">
                  <tbody>
                    {topicContent.estimationTable.rows.map((row) => (
                      <tr key={row.label} className="border-t border-slate-800/70">
                        <th scope="row" className="w-2/3 px-6 py-3 font-medium text-slate-200">
                          {row.label}
                        </th>
                        <td className="px-6 py-3 text-slate-300">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {topicContent.blocks.map((block) => (
              <article key={block.heading} className="space-y-3 rounded-3xl border border-slate-800/70 bg-[#0b172a] p-8 text-sm text-slate-300">
                <h2 className="text-xl font-semibold text-white">{block.heading}</h2>
                {block.body ? <p className="leading-6">{block.body}</p> : null}
                {block.paragraphs
                  ? block.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={`${block.heading}-paragraph-${paragraphIndex}`} className="leading-6">
                        {paragraph}
                      </p>
                    ))
                  : null}
                {block.bullets ? (
                  <ul className="space-y-2">
                    {block.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {block.groups ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {block.groups.map((group, groupIndex) => (
                      <div key={`${block.heading}-group-${groupIndex}`} className="rounded-2xl border border-slate-800/70 bg-[#0f1d36] p-4">
                        {group.title ? <h3 className="text-sm font-semibold text-white">{group.title}</h3> : null}
                        <ul className="mt-2 space-y-1 text-slate-300">
                          {group.items.map((item) => (
                            <li key={`${group.title ?? 'item'}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
              <h3 className="text-base font-semibold text-white">Examiner tips</h3>
              <ul className="space-y-2">
                {topicContent.examinerTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-amber-300" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 rounded-3xl border border-slate-800/70 bg-[#0b172a] p-6 text-sm text-slate-200">
              <h3 className="text-base font-semibold text-white">{topicContent.teacherCallout.title}</h3>
              <p className="leading-6 text-slate-300">{topicContent.teacherCallout.body}</p>
              {topicContent.teacherCallout.bullets ? (
                <ul className="space-y-2 text-sm text-slate-300">
                  {topicContent.teacherCallout.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {topicContent.teacherCallout.ctaLabel ? (
                <Link
                  to={topicContent.teacherCallout.ctaHref ?? '#'}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                >
                  {topicContent.teacherCallout.ctaLabel}
                </Link>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800/70 bg-[#0b172a] p-6 text-sm text-slate-200">
            <h3 className="text-base font-semibold text-white">Test yourself</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              {topicContent.studentActions.map((action) => (
                <li key={action} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-violet-400" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-800/70 bg-[#0b172a] px-6 py-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span>Was this page helpful?</span>
              <button type="button" className="rounded-full border border-slate-700/70 px-3 py-1 transition hover:border-sky-500 hover:text-white">
                Yes
              </button>
              <button type="button" className="rounded-full border border-slate-700/70 px-3 py-1 transition hover:border-sky-500 hover:text-white">
                No
              </button>
            </div>
            <div className="flex items-center gap-2">
              {previousEntry ? (
                <Link
                  to={linkForEntry(previousEntry)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 px-3 py-1 transition hover:border-sky-500 hover:text-white"
                >
                  Prev
                </Link>
              ) : (
                <span className="rounded-full border border-slate-800/70 px-3 py-1 text-slate-600">Prev</span>
              )}
              {nextEntry ? (
                <Link
                  to={linkForEntry(nextEntry)}
                  className="inline-flex items-center gap-1 rounded-full border border-sky-500 bg-sky-500 px-3 py-1 text-white transition hover:bg-sky-400"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-full border border-slate-800/70 px-3 py-1 text-slate-600">Next</span>
              )}
            </div>
          </footer>
        </main>
      </div>
    </SiteLayout>
  );
};
