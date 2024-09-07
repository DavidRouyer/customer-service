import { CheckCircle2, Circle } from 'lucide-react';

import { TicketPriority, TicketStatus } from '@cs/kyaku/models';
import {
  PriorityCritical,
  PriorityHigh,
  PriorityLow,
  PriorityMedium,
} from '@cs/ui/icons';

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
    icon: PriorityLow,
  },
  {
    label: 'Medium',
    value: TicketPriority.Medium,
    icon: PriorityMedium,
  },
  {
    label: 'High',
    value: TicketPriority.High,
    icon: PriorityHigh,
  },
  {
    label: 'Critical',
    value: TicketPriority.Critical,
    icon: PriorityCritical,
  },
];
