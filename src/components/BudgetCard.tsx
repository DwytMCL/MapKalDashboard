// src/components/BudgetCard.tsx
import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';

export default function BudgetCard() {
  const budget = useBudget();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="card">
      <div
        className="flex justify-between items-center mb-4 cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Budget Overview
          <span className="ml-2 text-gray-500 text-sm">{isOpen ? '▲' : '▼'}</span>
        </h2>
      </div>

      {isOpen && budget && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total */}
          <div className="glass-gradient-budget p-4 text-center hover-lift">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₱{budget.budget.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* GCash */}
          <div className="glass-gradient-budget p-4 text-center hover-lift">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">GCash</p>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              ₱{budget.gcashTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Cash */}
          <div className="glass-gradient-budget p-4 text-center hover-lift">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cash</p>
            <p className="text-2xl font-bold text-yellow-400 dark:text-amber-400">
              ₱{budget.cashTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 text-center">
          <a
            href={`https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_GOOGLE_SHEET_ID}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 dark:text-yellow-400 hover:underline"
          >
            View finance tracker
          </a>
        </div>
      )}
    </div>
  );
}
