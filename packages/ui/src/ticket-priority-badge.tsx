import type { FC } from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import type { TicketPriority } from '@cs/kyaku/models';

export const TicketPriorityBadge: FC<{
  priority: TicketPriority;
}> = ({ priority }) => {
  return {
    CRITICAL: (
      <>
        <ShieldAlert className="inline-flex size-4 text-destructive" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.critical" />
        </span>
      </>
    ),
    HIGH: (
      <>
        <Shield className="inline-flex size-4 text-destructive" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.high" />
        </span>
      </>
    ),
    MEDIUM: (
      <>
        <Shield className="inline-flex size-4 text-warning" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.medium" />
        </span>
      </>
    ),
    LOW: (
      <>
        <Shield className="inline-flex size-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.low" />
        </span>
      </>
    ),
  }[priority];
};
