// src/components/Header.tsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Button } from '../ui/Button';

export default function Header({ onLogout }: { onLogout: () => void }) {
  const { user } = useContext(AuthContext);
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-50 glass-gradient-header p-0 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/mapkal-logo.png" alt="MapKal Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-gradient shadow-md" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">MapKal Dashboard</h1>
            {user?.displayName && (
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">Welcome! {user.displayName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
            size="sm"
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button type="button" onClick={onLogout} size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
