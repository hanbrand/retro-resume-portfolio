// Navigation configuration constants
export const TAB_ORDER = ['about', 'skills', 'experience', 'contact'] as const;

export const BUTTON_TO_TAB_MAP = {
  'a': 'about',
  'b': 'contact', 
  'x': 'skills',
  'y': 'experience'
} as const;

export type TabValue = typeof TAB_ORDER[number];
export type ButtonKey = keyof typeof BUTTON_TO_TAB_MAP; 