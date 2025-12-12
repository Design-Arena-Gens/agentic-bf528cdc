'use client';

import { useMemo, useState } from 'react';
import { EXPENSE_CATEGORIES } from '../../lib/constants';
import type { Expense, ExpenseCategory } from '../../lib/types';

export interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  onImport?: (expenses: Expense[]) => void;
}

const initialCategory: ExpenseCategory = 'Food';

const createEmptyExpense = () => ({
  description: '',
  amount: '',
  category: initialCategory,
  date: new Date().toISOString().slice(0, 10),
  notes: ''
});

type DraftExpense = ReturnType<typeof createEmptyExpense>;

export default function ExpenseForm({ onSubmit, onImport }: ExpenseFormProps) {
  const [draft, setDraft] = useState<DraftExpense>(createEmptyExpense);
  const [importErrors, setImportErrors] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const categories = useMemo(() => EXPENSE_CATEGORIES, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.description.trim() || !draft.amount) {
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: draft.description.trim(),
      amount: Number.parseFloat(draft.amount),
      category: draft.category,
      date: new Date(draft.date).toISOString(),
      notes: draft.notes.trim() || undefined
    };

    onSubmit(expense);
    setDraft(createEmptyExpense());
  };

  const handleChange = (
    key: keyof DraftExpense,
    value: string
  ) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImport) return;

    setIsImporting(true);
    setImportErrors(null);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(Boolean);
      const importedExpenses: Expense[] = lines.map(line => {
        const [date, description, amount, category, notes] = line.split(',');
        if (!date || !description || !amount) {
          throw new Error('Missing required fields');
        }
        const lowerCategory = (category || '').trim();
        const matchedCategory = categories.find(
          item => item.toLowerCase() === lowerCategory.toLowerCase()
        );
        return {
          id: crypto.randomUUID(),
          date: new Date(date).toISOString(),
          description: description.trim(),
          amount: Number.parseFloat(amount),
          category: matchedCategory ?? 'Other',
          notes: notes?.trim() || undefined
        };
      });

      onImport(importedExpenses);
      event.target.value = '';
    } catch (error) {
      setImportErrors(
        error instanceof Error ? error.message : 'Unable to import file'
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Add Expense</h2>
          <p className="text-sm text-slate-500">Capture spending in seconds.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500">
          <input
            type="file"
            accept="text/csv,.csv"
            className="hidden"
            onChange={handleImport}
            disabled={isImporting}
          />
          <span className="rounded-full bg-brand-50 px-3 py-1">Import CSV</span>
        </label>
      </header>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-6" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={draft.date}
            onChange={event => handleChange('date', event.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="Groceries"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={draft.description}
            onChange={event => handleChange('description', event.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="45.00"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={draft.amount}
            onChange={event => handleChange('amount', event.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={draft.category}
            onChange={event => handleChange('category', event.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="notes">
            Notes
          </label>
          <input
            id="notes"
            type="text"
            placeholder="Optional memo"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={draft.notes}
            onChange={event => handleChange('notes', event.target.value)}
          />
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-300"
          >
            Add Expense
          </button>
        </div>
      </form>

      {importErrors && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {importErrors}
        </p>
      )}
    </section>
  );
}
