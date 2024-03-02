import { cx, CXOptions } from 'cva';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: CXOptions) {
  return twMerge(cx(inputs));
}
