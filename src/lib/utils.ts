import clsx, { type ClassValue } from "clsx";

/** Thin wrapper around clsx so components can compose conditional classNames cleanly. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
