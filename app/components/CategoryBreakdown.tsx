'use client';

import type { Expense } from '../../lib/types';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export default function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  if (expenses.length === 0) {
    return null;
  }

  const totals = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
    return acc;
  }, {});

  const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);

  const sorted = Object.entries(totals).sort(([, a], [, b]) => b - a);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Category breakdown</h2>
        <p className="text-sm text-slate-500">See where your money goes.</p>
      </header>

      <ul className="space-y-3 text-sm">
        {sorted.map(([category, total]) => {
          const percentage = grandTotal === 0 ? 0 : (total / grandTotal) * 100;
          return (
            <li key={category}>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium text-slate-800">{category}</span>
                <span>{currencyFormatter.format(total)}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{percentage.toFixed(1)}% of spending</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
