import { slugify } from '../utils/slug';

export type ResourceType =
  | 'revision-notes'
  | 'exam-questions'
  | 'smart-mark'
  | 'flashcards'
  | 'mock-exams'
  | 'target-test'
  | 'past-papers'
  | 'test-builder';

export const resourceTypeLabels: Record<ResourceType, string> = {
  'exam-questions': 'Exam Questions',
  'revision-notes': 'Revision Notes',
  'smart-mark': 'Smart Mark',
  flashcards: 'Flashcards',
  'mock-exams': 'Mock Exams',
  'target-test': 'Target Test',
  'past-papers': 'Past Papers',
  'test-builder': 'Test Builder',
};

const defaultResourceTypes: ResourceType[] = [
  'revision-notes',
  'exam-questions',
  'smart-mark',
  'flashcards',
  'mock-exams',
  'target-test',
  'past-papers',
  'test-builder',
];

export interface RevisionNotesSection {
  title: string;
  topics: string[];
}

export interface RevisionNotesContent {
  examCode?: string;
  sections: RevisionNotesSection[];
}

export interface ExamBoard {
  name: string;
  slug: string;
  examCode?: string;
  meta?: string;
  resources: ResourceType[];
  revisionNotes?: RevisionNotesContent;
}

export interface SubjectCatalog {
  name: string;
  slug: string;
  examBoards: ExamBoard[];
}

export interface LevelCatalog {
  name: string;
  slug: string;
  popularSubjects: string[];
  subjects: SubjectCatalog[];
}

const physicsRevisionSections: RevisionNotesSection[] = [
  {
    title: '1. Working as a Physicist',
    topics: ['Working as a Physicist'],
  },
  {
    title: '2. Mechanics',
    topics: ['Motion', 'Forces and Momentum', 'Moments', 'Work, Energy and Power'],
  },
  {
    title: '3. Electric Circuits',
    topics: [
      'Current, Potential Difference, Resistance and Power',
      'Resistance, Resistivity and Potential Dividers',
      'E.M.F and Modelling Resistance',
    ],
  },
  {
    title: '4. Materials',
    topics: ['Density, Upthrust and Viscous Drag', 'Stretching Materials'],
  },
  {
    title: '5. Waves and Particle Nature of Light',
    topics: [
      'Transverse and Longitudinal Waves',
      'Interference and Stationary Waves',
      'Refraction, Reflection and Polarisation',
      'Waves, Electrons and Photons',
    ],
  },
];

const buildBoards = (examCodes: Record<string, string>): ExamBoard[] => {
  const boardNames = ['AQA', 'Edexcel', 'OCR', 'Edexcel International', 'Cambridge (CIE)', 'Oxford AQA', 'WJEC'];

  return boardNames.map((name) => {
    const slug = slugify(name);
    const examCode = examCodes[slug];
    return {
      name,
      slug,
      examCode,
      resources: [...defaultResourceTypes],
      revisionNotes: {
        examCode,
        sections: physicsRevisionSections,
      },
      meta: name === 'Cambridge (CIE)' ? 'First exams 2025' : undefined,
    };
  });
};

const gcseBoards = buildBoards({
  aqa: '8463',
  edexcel: '1PH0',
  ocr: 'J249',
  'edexcel-international': '4PH1',
  'cambridge-cie': '0625',
  'oxford-aqa': '9310',
  wjec: '3700QS',
});

const ialBoards = buildBoards({
  aqa: '7357',
  edexcel: '8PH0',
  ocr: 'H156',
  'edexcel-international': '4PH1',
  'cambridge-cie': '9702',
  'oxford-aqa': '9531',
  wjec: 'A200QS',
});

const cloneSubjects = (subjects: SubjectCatalog[]): SubjectCatalog[] =>
  subjects.map((subject) => ({
    ...subject,
    examBoards: subject.examBoards.map((board) => ({
      ...board,
      resources: [...board.resources],
      revisionNotes: board.revisionNotes
        ? {
            examCode: board.revisionNotes.examCode,
            sections: board.revisionNotes.sections.map((section) => ({
              ...section,
              topics: [...section.topics],
            })),
          }
        : undefined,
    })),
  }));

const baseSubjects: SubjectCatalog[] = [
  {
    name: 'Biology',
    slug: 'biology',
    examBoards: gcseBoards,
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    examBoards: gcseBoards,
  },
  {
    name: 'Physics',
    slug: 'physics',
    examBoards: ialBoards,
  },
  {
    name: 'Maths',
    slug: 'maths',
    examBoards: gcseBoards,
  },
  {
    name: 'English Literature',
    slug: 'english-literature',
    examBoards: gcseBoards,
  },
  {
    name: 'Psychology',
    slug: 'psychology',
    examBoards: gcseBoards,
  },
  {
    name: 'Computer Science',
    slug: 'computer-science',
    examBoards: gcseBoards,
  },
  {
    name: 'Geography',
    slug: 'geography',
    examBoards: gcseBoards,
  },
  {
    name: 'History',
    slug: 'history',
    examBoards: gcseBoards,
  },
  {
    name: 'Business',
    slug: 'business',
    examBoards: gcseBoards,
  },
  {
    name: 'Economics',
    slug: 'economics',
    examBoards: gcseBoards,
  },
  {
    name: 'French',
    slug: 'french',
    examBoards: gcseBoards,
  },
  {
    name: 'Religious Studies',
    slug: 'religious-studies',
    examBoards: gcseBoards,
  },
  {
    name: 'Statistics',
    slug: 'statistics',
    examBoards: gcseBoards,
  },
  {
    name: 'Physics (International)',
    slug: 'physics-international',
    examBoards: ialBoards,
  },
];

const popularSubjects = ['biology', 'chemistry', 'physics', 'maths', 'english-literature', 'psychology'];

export const resourceCatalog: LevelCatalog[] = [
  {
    name: 'GCSE',
    slug: 'gcse',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'IGCSE',
    slug: 'igcse',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'AS',
    slug: 'as',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'A Level',
    slug: 'a-level',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'IB',
    slug: 'ib',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'O Level',
    slug: 'o-level',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'AP',
    slug: 'ap',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
  {
    name: 'Other',
    slug: 'other',
    popularSubjects,
    subjects: cloneSubjects(baseSubjects),
  },
];

export const buildResourcePath = (
  levelSlug: string,
  subjectSlug: string,
  boardSlug: string,
  resourceType: ResourceType,
) => `/resources/${levelSlug}/${subjectSlug}/${boardSlug}/${resourceType}`;

export interface ResourceContext {
  level: LevelCatalog;
  subject: SubjectCatalog;
  board: ExamBoard;
}

export const findResourceContext = (
  levelSlug: string,
  subjectSlug: string,
  boardSlug: string,
): ResourceContext | null => {
  const level = resourceCatalog.find((item) => item.slug === levelSlug);
  if (!level) {
    return null;
  }

  const subject = level.subjects.find((item) => item.slug === subjectSlug);
  if (!subject) {
    return null;
  }

  const board = subject.examBoards.find((item) => item.slug === boardSlug);
  if (!board) {
    return null;
  }

  return { level, subject, board };
};
