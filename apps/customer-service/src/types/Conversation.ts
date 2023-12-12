import { RouterOutputs } from '@cs/api';

export type TimelineItem = RouterOutputs['ticketTimeline']['byTicketId'][0];

export type TimelineByDay = Record<string, TimelineItem[]>;
