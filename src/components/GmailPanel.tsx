// src/components/GmailPanel.tsx
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Email, useEmails } from "../hooks/useEmails";
import { Timestamp } from "firebase/firestore";

function formatDate(value: Timestamp | string | null | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Timestamp) return format(value.toDate(), "PPp");
  try {
    return format(new Date(value as any), "PPp");
  } catch {
    return "";
  }
}

export default function GmailPanel() {
  const { emails, loading, remove, search } = useEmails();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const filtered = useMemo(() => search(term), [term, search]);
  const selected: Email | undefined = useMemo(
    () => filtered.find((e) => e.id === selectedId) ?? filtered[0],
    [filtered, selectedId]
  );

  return (
    <div className="card">
      <h2
        id="gmail-title"
        className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 cursor-pointer select-none"
        aria-expanded={isOpen}
        aria-controls="gmail-panel"
        onClick={() => setIsOpen((p) => !p)}
      >
        Gmail
        <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          {isOpen ? "v" : ">"}
        </span>
      </h2>

      {isOpen && (
        <div
          id="gmail-panel"
          aria-labelledby="gmail-title"
          className="flex flex-col sm:flex-row h-[28rem] sm:h-[34rem] w-full overflow-hidden rounded-md sm:rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          {/* Sidebar */}
          <div className="w-full sm:w-80 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 flex flex-col p-2">
            <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search mail..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  No messages found.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((m) => {
                    const active = (selected?.id ?? null) === m.id;
                    return (
                      <li
                        key={m.id}
                        className={`cursor-pointer px-4 py-3 transition ${
                          active
                            ? "bg-indigo-50 dark:bg-indigo-900/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-900"
                        }`}
                        onClick={() => setSelectedId(m.id)}
                        title={m.subject || m.message.slice(0, 80)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {m.sender || m.senderEmail}
                            </div>
                            {(m.subject || m.message) && (
                              <div className="truncate text-xs text-gray-600 dark:text-gray-400">
                                {m.subject || m.message}
                              </div>
                            )}
                          </div>
                          <div className="whitespace-nowrap pl-2 text-[11px] text-gray-500 dark:text-gray-400">
                            {formatDate(m.date)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Main message panel */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-2 sm:p-4 dark:border-gray-700">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selected?.subject || "No subject"}
                </div>
                <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {selected
                    ? `${selected.sender || "Unknown"} <${
                        selected.senderEmail
                      }> - ${formatDate(selected?.date)}`
                    : "Select a message"}
                </div>
              </div>

              {selected && (
                <button
                  onClick={() => remove(selected.id)}
                  className="glass-btn-danger text-xs hover-lift"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3 sm:p-5">
              {selected ? (
                <div className="prose prose-sm max-w-none dark:prose-invert dark:text-white">
                  <p className="whitespace-pre-wrap">{selected.message}</p>
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  Pick a message from the left.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

