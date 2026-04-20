import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 will-change-transform active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:brightness-110 shadow-[0_8px_24px_-8px_rgb(var(--accent)/0.6)] hover:shadow-[0_12px_32px_-8px_rgb(var(--accent)/0.7)]",
  secondary:
    "bg-surface text-fg border border-border hover:border-fg/30 hover:bg-surface-2",
  ghost: "text-fg hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[0.95rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchor } = rest as ButtonAsLink;
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={classes} {...anchor}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(anchor as Record<string, unknown>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
