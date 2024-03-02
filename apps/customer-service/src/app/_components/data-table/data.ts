import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  ShieldAlert,
} from 'lucide-react';

import { TicketPriority, TicketStatus } from '@cs/kyaku/models';

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
];

export const statuses = [
  {
    value: TicketStatus.Open,
    label: 'Open',
    icon: Circle,
  },
  {
    value: TicketStatus.Done,
    label: 'Done',
    icon: CheckCircle2,
  },
];

export const priorities = [
  {
    label: 'Low',
    value: TicketPriority.Low,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: TicketPriority.Medium,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: TicketPriority.High,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    value: TicketPriority.Critical,
    icon: ShieldAlert,
  },
];
