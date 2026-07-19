import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names safely, resolving Tailwind class conflicts
 * @param {...(string|Object|Array)} inputs - Class names, objects, or arrays
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
