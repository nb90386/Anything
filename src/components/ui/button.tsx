import { ButtonHTMLAttributes, cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-card hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300",
  secondary:
    "bg-ink-900/[0.04] text-ink-900 hover:bg-ink-900/[0.08] dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]",
  outline:
    "border border-ink-200 dark:border-ink-700 bg-transparent text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-800/50",
  ghost: "bg-transparent text-ink-700 dark:text-ink-200 hover:bg-ink-900/[0.05] dark:hover:bg-white/[0.06]",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-[15px] gap-2 rounded-xl",
  icon: "h-9 w-9 rounded-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Render props onto the single child element instead of a <button> (for wrapping next/link). */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-ink-950",
      "disabled:pointer-events-none disabled:opacity-50",
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return cloneElement(child, {
        className: cn(classes, child.props.className),
        ...props,
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
