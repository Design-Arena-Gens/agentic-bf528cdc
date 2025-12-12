import type { Expense } from './types';

const STORAGE_KEY = 'personal-expense-tracker::expenses';

export const loadExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Expense[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load expenses from storage', error);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.warn('Failed to save expenses to storage', error);
  }
};
