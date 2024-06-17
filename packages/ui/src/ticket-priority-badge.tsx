import type { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import type { TicketPriority } from '@cs/kyaku/models';
import {
  PriorityCritical,
  PriorityHigh,
  PriorityLow,
  PriorityMedium,
} from '@cs/ui/icons';

export const TicketPriorityBadge: FC<{
  priority: TicketPriority;
}> = ({ priority }) => {
  return {
    CRITICAL: (
      <>
        <PriorityCritical className="inline-flex size-4" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.critical" />
        </span>
      </>
    ),
    HIGH: (
      <>
        <PriorityHigh className="inline-flex size-4" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.high" />
        </span>
      </>
    ),
    MEDIUM: (
      <>
        <PriorityMedium className="inline-flex size-4" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.medium" />
        </span>
      </>
    ),
    LOW: (
      <>
        <PriorityLow className="inline-flex size-4" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.low" />
        </span>
      </>
    ),
  }[priority];
};
