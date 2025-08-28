import { ComponentProps } from "react";
import { cx } from "./cx";

const base = "input bg-white dark:bg-gray-800 text-gray-800 dark:text-white";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cx(base, "ring-focus", className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cx(base, "ring-focus", className)} {...props} />;
}
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cx(base, className)} {...props} />;
}
