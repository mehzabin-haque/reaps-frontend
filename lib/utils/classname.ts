// src/lib/utils/classnames.ts
export function cn(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }