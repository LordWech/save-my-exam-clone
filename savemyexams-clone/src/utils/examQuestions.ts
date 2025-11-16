import type { ResourceContext } from '../data/resources';
import { slugify } from './slug';

export interface ExamTopicCard {
  title: string;
  description: string;
  questionCount: number;
  downloadLabel: string;
  slug: string;
}

export interface ExamTopicSection {
  id: string;
  title: string;
  slug: string;
  estimatedHours: number;
  totalQuestions: number;
  cards: ExamTopicCard[];
}

export const createTopicSummary = (topic: string) => {
  const trimmed = topic.replace(/\s+/g, ' ').trim();
  return `${trimmed} exam-style questions with detailed worked solutions.`;
};

export const buildExamSections = (context: ResourceContext): ExamTopicSection[] => {
  const sections = context.board.revisionNotes?.sections ?? [];

  return sections.map((section, index) => {
    const sectionSlug = slugify(section.title);
    const baseHours = Math.max(1, section.topics.length * 2 + index);
    const totalQuestions = section.topics.length * 15 + 30;

    return {
      id: sectionSlug,
      title: section.title,
      slug: sectionSlug,
      estimatedHours: baseHours,
      totalQuestions,
      cards: section.topics.map((topic, topicIndex) => ({
        title: topic,
        description: createTopicSummary(topic),
        questionCount: 8 + topicIndex * 3,
        downloadLabel: 'Download PDFs',
        slug: slugify(topic),
      })),
    };
  });
};

export const findExamSection = (sections: ExamTopicSection[], sectionSlug: string) =>
  sections.find((section) => section.slug === sectionSlug);

export const findExamTopic = (section: ExamTopicSection | undefined, topicSlug: string) =>
  section?.cards.find((card) => card.slug === topicSlug);
