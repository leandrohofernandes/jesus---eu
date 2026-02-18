export interface UserProfile {
  id?: string;
  name: string;
  addictions: string[];
  frequency: string;
  triggers: string[];
  struggleDuration: string;
  wantsChallenges: boolean;
  onboardingCompleted: boolean;
  cleanDate: string; // ISO Date string
  relapseHistory: string[]; // Array of ISO Date strings
  bestStreak: number;
  completedDevotionals: string[]; // Array of date strings (YYYY-MM-DD)
}

export interface DevotionalContent {
  date: string;
  verse: {
    text: string;
    reference: string;
  };
  spiritualExplanation: string;
  scientificBasis: string;
  reflectionQuestion: string;
  concreteAction: string;
  inevitabilityQuote: string;
}

export enum AppView {
  LOGIN = 'LOGIN',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  EMERGENCY = 'EMERGENCY',
  PROFILE = 'PROFILE'
}

export const INITIAL_PROFILE: UserProfile = {
  name: '',
  addictions: [],
  frequency: '',
  triggers: [],
  struggleDuration: '',
  wantsChallenges: true,
  onboardingCompleted: false,
  cleanDate: new Date().toISOString(),
  relapseHistory: [],
  bestStreak: 0,
  completedDevotionals: []
};