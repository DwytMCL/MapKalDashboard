// src/components/QuickLinks.tsx
import { useState } from 'react';

export default function QuickLinks() {
  const [isOpen, setIsOpen] = useState(true);

  const links = [
    { name: 'Finance Tracker', url: `https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_GOOGLE_SHEET_ID}` },
    { name: 'File Storage', url: `https://drive.google.com/drive/folders/${process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID}` },
    { name: 'Calendar of Activities', url: `https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_CALENDAR}` },
    { name: 'When2Meet', url: process.env.REACT_APP_WHEN2MEET || 'https://www.when2meet.com/' },
  ];

  return (
    <div className="card">
      <h2
        id="ql-title"
        className="text-lg font-semibold text-gray-800 dark:text-white cursor-pointer select-none flex items-center mb-2"
        aria-expanded={isOpen}
        aria-controls="ql-panel"
        onClick={() => setIsOpen(prev => !prev)}
      >
        Quick Links
        <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
      </h2>

      {isOpen && (
        <ul id="ql-panel" aria-labelledby="ql-title" className="space-y-1">
          {links.map(l => (
            <li key={l.name}>
              <a href={l.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-yellow-400 hover:underline">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}