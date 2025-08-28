import { ComponentProps } from "react";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "danger" | "glass" | "glass-primary" | "glass-danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3.5 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
};

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  glass: "glass-btn",
  "glass-primary": "glass-btn-primary",
  "glass-danger": "glass-btn-danger",
};

type Props = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ className, variant = "glass", size = "md", ...props }: Props) {
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...props} />
  );
}
