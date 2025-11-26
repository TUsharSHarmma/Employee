import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 transition-all duration-300 transform ${
            isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`} 
          size={20}
        />
        <Moon 
          className={`absolute inset-0 transition-all duration-300 transform ${
            isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`} 
          size={20}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;