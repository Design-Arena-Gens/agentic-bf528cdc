'use client';

import { useEffect, useState } from 'react';
import { EXPENSE_CATEGORIES } from '../../lib/constants';
import type { ExpenseCategory } from '../../lib/types';

export interface ExpenseFiltersProps {
  onChange: (filters: FiltersState) => void;
}

export interface FiltersState {
  category: ExpenseCategory | 'All';
  query: string;
  timeframe: '30days' | '90days' | 'all';
}

const initialState: FiltersState = {
  category: 'All',
  query: '',
  timeframe: '90days'
};

export default function ExpenseFilters({ onChange }: ExpenseFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>(initialState);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const update = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div>
        <label htmlFor="timeframe" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Time
        </label>
        <select
          id="timeframe"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={filters.timeframe}
          onChange={event => update('timeframe', event.target.value as FiltersState['timeframe'])}
        >
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Category
        </label>
        <select
          id="category"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={filters.category}
          onChange={event => update('category', event.target.value as ExpenseCategory | 'All')}
        >
          <option value="All">All</option>
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="query" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Search
        </label>
        <input
          id="query"
          type="search"
          placeholder="Find groceries, rent, utilities..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={filters.query}
          onChange={event => update('query', event.target.value)}
        />
      </div>

      <button
        type="button"
        className="self-end rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-400 hover:text-brand-600"
        onClick={() => setFilters(initialState)}
      >
        Reset
      </button>
    </section>
  );
}
