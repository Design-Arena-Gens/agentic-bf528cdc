export type ExpenseCategory =
  | 'Housing'
  | 'Food'
  | 'Transportation'
  | 'Utilities'
  | 'Health'
  | 'Entertainment'
  | 'Shopping'
  | 'Savings'
  | 'Other';

export interface Expense {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  category: ExpenseCategory;
  notes?: string;
}
