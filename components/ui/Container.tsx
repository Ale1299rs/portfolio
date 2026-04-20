import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  size?: "default" | "tight" | "wide";
};

export function Container({ as: Tag = "div", className, children, size = "default" }: ContainerProps) {
  const max =
    size === "tight" ? "max-w-3xl" : size === "wide" ? "max-w-7xl" : "max-w-6xl";
  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", max, className)}>
      {children}
    </Tag>
  );
}
