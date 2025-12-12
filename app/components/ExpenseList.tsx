'use client';

import { format } from 'date-fns';
import { Fragment } from 'react';
import type { Expense } from '../../lib/types';

export interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-sm text-slate-500">
        No expenses yet. Add your first one above.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left font-semibold text-slate-600">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {expenses.map(expense => (
            <Fragment key={expense.id}>
              <tr className="transition hover:bg-slate-50/70">
                <td className="px-4 py-3 align-top text-slate-600">
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 align-top text-slate-900">
                  <div className="font-medium">{expense.description}</div>
                  {expense.notes && (
                    <div className="text-xs text-slate-500">{expense.notes}</div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-right font-semibold text-slate-900">
                  {currencyFormatter.format(expense.amount)}
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}
