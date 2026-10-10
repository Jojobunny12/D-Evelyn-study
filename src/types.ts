export interface Course {
  code: string;
  name: string;
  department: 'English' | 'Social Studies' | 'Foreign Language' | 'Mathematics' | 'Science' | 'Fine Arts' | 'Electives';
  description: string;
  curriculumDetails: string;
  examFocus: string;
  studyStrategy: string;
}

export interface StudySummary {
  title: string;
  curriculumExplanation: string;
  topTipsForFinal: string[];
  synthesizedNotesParagraph: string;
  coreCheatSheetMarkdown: string;
}

export interface TimelineDay {
  dayName: string;
  activityTitle: string;
  activityDescription: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyDeck {
  id: string;
  timestamp: string;
  schoolName?: string;
  courseCode: string;
  courseName: string;
  summary: StudySummary;
  timeline: TimelineDay[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  additionalNotes?: string;
  pastedTextSnippet?: string;
}
