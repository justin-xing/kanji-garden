export const LearnView = {
  LIST: 'LIST',
  SESSION: 'SESSION'
}

export type LearnViewType = (typeof LearnView)[keyof typeof LearnView];

export const LearnStep = {
  SECTION_START: 'SECTION_START',
  INTRO: 'INTRO',
  TRACE: 'TRACE',
  MNEMONIC: 'MNEMONIC',
  QUIZ_MEANING: 'QUIZ_MEANING',
  QUIZ_DRAW: 'QUIZ_DRAW',
  COMPLETED: 'COMPLETED'
}

export type LearnStepType = (typeof LearnStep)[keyof typeof LearnStep];

export interface UserProgress {
  lessonIndex: number;
  kanjiIndex: number;
  currentStep?: LearnStepType;
}

export interface DrawnShape {
  path: { x: number; y: number }[];
  label: string;
}
