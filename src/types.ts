export interface Blueprint {
  bigWhy: string;
  identityStatement: string;
  automationRule: string;
  frictionReducers: string[];
  smallestStep: string;
  coachMessage: string;
}

export interface Task {
  id: string;
  userId?: string;
  name: string;
  context?: string;
  createdAt: string;
  blueprint?: Blueprint;
  history: string[]; // dates when completed (YYYY-MM-DD)
  streak: number;
  maxStreak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
}

export interface InspirationQuote {
  text: string;
  author: string;
}
