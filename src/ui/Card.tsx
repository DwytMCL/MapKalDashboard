import { ComponentProps } from "react";
import { cx } from "./cx";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("card", className)} {...props} />;
}
