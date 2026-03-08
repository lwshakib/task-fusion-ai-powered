import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes.
 * Combines 'clsx' (for conditional classes) and 'tw-merge' (to resolve Tailwind conflicts).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
