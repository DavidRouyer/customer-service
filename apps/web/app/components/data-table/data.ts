import { CheckCircle2, Circle, CirclePause } from 'lucide-react';

import { TicketPriority, TicketStatus } from '@kyaku/kyaku/models';
import {
  PriorityCritical,
  PriorityHigh,
  PriorityLow,
  PriorityMedium,
} from '@kyaku/ui/icons';

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
    value: TicketStatus.Done,
    label: 'Done',
    icon: CheckCircle2,
  },
  {
    value: TicketStatus.Snoozed,
    label: 'Snoozed',
    icon: CirclePause,
  },
  {
    value: TicketStatus.Todo,
    label: 'Todo',
    icon: Circle,
  },
];

export const priorities = [
  {
    label: 'Critical',
    value: TicketPriority.Critical,
    icon: PriorityCritical,
  },
  {
    label: 'High',
    value: TicketPriority.High,
    icon: PriorityHigh,
  },
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
];
