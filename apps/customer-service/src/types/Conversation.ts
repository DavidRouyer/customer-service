import { RouterOutputs } from '@cs/api';

export type TimelineItem = RouterOutputs['ticket']['timeline'][0];

export type TimelineByDay = Record<string, TimelineItem[]>;
