// src/components/MessengerPanel.tsx
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where, limit, Timestamp } from 'firebase/firestore';
import { firestoreDB } from '../lib/firebase';

type Message = {
  id: string;
  sender: string;
  text: string;
  createdAt?: Timestamp;
};

function toDateString(ts?: Timestamp) {
  if (!ts) return new Date().toLocaleString('en-PH');
  return ts.toDate().toLocaleString('en-PH');
}

export default function MessengerPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    const now = Date.now();
    const DISPLAY_MS = 3 * 24 * 60 * 60 * 1000;
    const minDate = new Date(now - DISPLAY_MS);

    const q = query(
      collection(firestoreDB, 'messages'),
      where('createdAt', '>=', minDate),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Message[];
      setMessages(rows);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="card ">
      <h2
        id="msg-title"
        className="text-lg font-semibold text-gray-800 dark:text-white mb-3 cursor-pointer select-none"
        aria-expanded={isOpen}
        aria-controls="msg-panel"
        onClick={() => setIsOpen((p) => !p)}
      >
        Messenger Updates
        <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
      </h2>

      {isOpen && (
        <div id="msg-panel" aria-labelledby="msg-title">
          {loading ? (
            <p className="text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500">No recent messages.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg) => (
                <li key={msg.id} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-800 dark:text-white">{msg.sender}</span>{' '}· {toDateString(msg.createdAt)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">{msg.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}