import { FC } from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketPriority as TicketPriorityType } from '@cs/lib/tickets/TicketPriority';

export const TicketPriority: FC<{
  priority: TicketPriorityType;
}> = ({ priority }) => {
  return {
    Critical: (
      <>
        <ShieldAlert className="inline-flex h-4 w-4 text-destructive" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.critical" />
        </span>
      </>
    ),
    High: (
      <>
        <Shield className="inline-flex h-4 w-4 text-destructive" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.high" />
        </span>
      </>
    ),
    Medium: (
      <>
        <Shield className="inline-flex h-4 w-4 text-warning" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.medium" />
        </span>
      </>
    ),
    Low: (
      <>
        <Shield className="inline-flex h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          <FormattedMessage id="ticket.priorities.low" />
        </span>
      </>
    ),
  }[priority];
};
