import { useState } from 'react';

export default function PanelTemplate() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="card">
      <div
        className="flex justify-between items-center mb-2 cursor-pointer select-none"
        aria-expanded={isOpen}
        aria-controls="panel-temp"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          New Panel
          <span className="ml-2 text-gray-500 text-sm">{isOpen ? '▲' : '▼'}</span>
        </h2>
      </div>

      {isOpen && (
        <p id="panel-temp" className="text-gray-600 dark:text-gray-300">Content goes here...</p>
      )}
    </div>
  );
}