import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";

type Props = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
};
const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ title, onClose, children, size="md" }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const node = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-3" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cx(
        "relative w-full rounded-md sm:rounded-lg p-4 sm:p-6 shadow-2xl bg-white dark:bg-gray-900",
        sizes[size]
      )}>
        {title && (
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          aria-label="Close" title="Close"
        >✕</button>
        {children}
      </div>
    </div>
  );
  return createPortal(node, document.body);
}
