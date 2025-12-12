'use client';

import { addDays, isAfter, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CategoryBreakdown from './components/CategoryBreakdown';
import ExpenseFilters, { type FiltersState } from './components/ExpenseFilters';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryCards from './components/SummaryCards';
import { loadExpenses, saveExpenses } from '../lib/storage';
import type { Expense } from '../lib/types';

const defaultFilters: FiltersState = {
  category: 'All',
  query: '',
  timeframe: '90days'
};

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  useEffect(() => {
    setExpenses(loadExpenses());
  }, []);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses(prev => [expense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  }, []);

  const importExpenses = useCallback((imported: Expense[]) => {
    setExpenses(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const next = [...prev];
      for (const expense of imported) {
        if (!existingIds.has(expense.id)) {
          next.push(expense);
        }
      }
      return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);

  const filteredExpenses = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();
    const timeframeCutoff = (() => {
      const today = new Date();
      switch (filters.timeframe) {
        case '30days':
          return subDays(today, 30);
        case '90days':
          return subDays(today, 90);
        default:
          return null;
      }
    })();

    return expenses.filter(expense => {
      const matchesCategory =
        filters.category === 'All' || expense.category === filters.category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        expense.description.toLowerCase().includes(normalizedQuery) ||
        expense.notes?.toLowerCase().includes(normalizedQuery);
      const matchesTimeframe =
        !timeframeCutoff || isAfter(addDays(new Date(expense.date), 1), timeframeCutoff);

      return matchesCategory && matchesQuery && matchesTimeframe;
    });
  }, [expenses, filters]);

  const handleFiltersChange = useCallback((nextFilters: FiltersState) => {
    setFilters(nextFilters);
  }, []);

  const handleExport = useCallback(() => {
    if (filteredExpenses.length === 0) return;
    const csv = [
      ['Date', 'Description', 'Amount', 'Category', 'Notes'].join(',')
    ]
      .concat(
        filteredExpenses.map(expense => [
          new Date(expense.date).toISOString().slice(0, 10),
          JSON.stringify(expense.description).slice(1, -1),
          expense.amount.toFixed(2),
          expense.category,
          expense.notes ? JSON.stringify(expense.notes).slice(1, -1) : ''
        ].join(','))
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [filteredExpenses]);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 text-center sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-500">Personal finance</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Minimalist expense tracker for everyday spending
          </h1>
        </div>
        <p className="max-w-2xl text-sm text-slate-600">
          Track purchases, spot trends, and stay on budget with a clean interface designed for personal finance mindfulness.
        </p>
      </header>

      <SummaryCards expenses={filteredExpenses} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ExpenseFilters onChange={handleFiltersChange} />
          <ExpenseForm onSubmit={addExpense} onImport={importExpenses} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-400 hover:text-brand-600"
            >
              Export filtered CSV
            </button>
          </div>
          <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
        </div>
        <CategoryBreakdown expenses={filteredExpenses} />
      </div>
    </main>
  );
}
