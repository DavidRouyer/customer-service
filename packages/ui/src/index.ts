import type { CXOptions } from 'cva';
import { cx } from 'cva';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: CXOptions) => twMerge(cx(inputs));
