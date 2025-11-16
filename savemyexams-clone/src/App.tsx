import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/Dashboard';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { ResourceTypePage } from './pages/ResourceTypePage';
import { BoardResourcePage } from './pages/BoardResourcePage';
import { BrowseResourcesPage } from './pages/BrowseResourcesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FlashcardsCollectionPage } from './pages/FlashcardsCollectionPage';
import { FlashcardsStillLearningPage } from './pages/FlashcardsStillLearningPage';
import { FlashcardsKnowPage } from './pages/FlashcardsKnowPage';
import { FlashcardsRevisitPage } from './pages/FlashcardsRevisitPage';
import { ExamQuestionTopicPage } from './pages/ExamQuestionTopicPage';
import { RevisionNotesTopicPage } from './pages/RevisionNotesTopicPage';

const App = () => (
	<Routes>
		<Route path="/" element={<DashboardPage />} />
		<Route path="/resources/browse" element={<BrowseResourcesPage />} />
		<Route path="/resources/type/:resourceType" element={<ResourceTypePage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/flashcards/still-learning" element={<FlashcardsStillLearningPage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/flashcards/know" element={<FlashcardsKnowPage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/flashcards/revisit" element={<FlashcardsRevisitPage />} />
		<Route
			path="/resources/:levelSlug/:subjectSlug/:boardSlug/revision-notes/:sectionSlug/:topicSlug"
			element={<RevisionNotesTopicPage />}
		/>
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/exam-questions/:sectionSlug/:topicSlug" element={<ExamQuestionTopicPage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/exam-questions/:sectionSlug/:topicSlug/:questionType" element={<ExamQuestionTopicPage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/flashcards/:topicSlug" element={<FlashcardsCollectionPage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug/:resourceType" element={<ResourceDetailPage />} />
		<Route path="/resources/:levelSlug/:subjectSlug/:boardSlug" element={<BoardResourcePage />} />
		<Route path="/not-found" element={<NotFoundPage />} />
		<Route path="*" element={<NotFoundPage />} />
	</Routes>
);

export default App;
