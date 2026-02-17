"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-condensed font-semibold text-lg transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

  const variants = {
    primary: "bg-green text-background glow-green hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-surface text-foreground border border-surface-light hover:bg-surface-light active:scale-[0.98]",
    ghost: "text-foreground/70 hover:text-foreground hover:bg-surface/50",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
