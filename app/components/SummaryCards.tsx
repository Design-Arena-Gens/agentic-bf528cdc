'use client';

import { eachMonthOfInterval, format, startOfMonth, subMonths } from 'date-fns';
import type { Expense } from '../../lib/types';

interface SummaryCardsProps {
  expenses: Expense[];
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const getMonthlyTotals = (expenses: Expense[]) => {
  const now = new Date();
  const months = eachMonthOfInterval({
    start: subMonths(startOfMonth(now), 2),
    end: startOfMonth(now)
  });

  return months.map(month => {
    const total = expenses
      .filter(expense => {
        const date = new Date(expense.date);
        return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: format(month, 'MMM yyyy'),
      total
    };
  });
};

const getAverageDailySpend = (expenses: Expense[]) => {
  if (expenses.length === 0) return 0;
  const totalsByDay = new Map<string, number>();
  for (const expense of expenses) {
    const dayKey = format(new Date(expense.date), 'yyyy-MM-dd');
    totalsByDay.set(dayKey, (totalsByDay.get(dayKey) ?? 0) + expense.amount);
  }
  const total = Array.from(totalsByDay.values()).reduce((sum, value) => sum + value, 0);
  return total / totalsByDay.size;
};

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const largestPurchase = expenses.reduce((largest, expense) =>
    expense.amount > largest.amount ? expense : largest,
    expenses[0] ?? { amount: 0, description: '', date: new Date().toISOString() }
  );
  const monthlyTotals = getMonthlyTotals(expenses);
  const averageDailySpend = getAverageDailySpend(expenses);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Total spent</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {currencyFormatter.format(totalSpent)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Across {expenses.length} recorded expenses
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Largest expense</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {currencyFormatter.format(largestPurchase?.amount ?? 0)}
        </p>
        <p className="mt-2 text-xs text-slate-500 line-clamp-2">
          {largestPurchase?.description || 'No expenses yet'}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Average daily</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {currencyFormatter.format(averageDailySpend || 0)}
        </p>
        <p className="mt-2 text-xs text-slate-500">Based on days with spending</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Last 3 months</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {monthlyTotals.map(item => (
            <li key={item.month} className="flex items-center justify-between">
              <span>{item.month}</span>
              <span className="font-medium">{currencyFormatter.format(item.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
