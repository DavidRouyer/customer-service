import { FC } from 'react';
import { FormattedDisplayName } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { CurrentTime } from '~/components/ui/current-time';
import { useTicket } from '~/hooks/useTicket/TicketProvider';
import { getInitials } from '~/utils/string';

export const InfoSummary: FC = () => {
  const { activeTicket } = useTicket();

  if (!activeTicket) {
    return null;
  }

  return (
    <div>
      <div className="flex space-x-3 border-b border-gray-900/5 pb-6">
        <div className="shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeTicket.contact.avatarUrl ?? undefined} />
            <AvatarFallback>
              {getInitials(activeTicket.contact.name ?? '')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a href="#" className="hover:underline">
              {activeTicket.contact.name}
            </a>
          </p>
          <p className="flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
            {activeTicket.contact.language && (
              <span>
                <FormattedDisplayName
                  value={activeTicket.contact.language.substring(0, 2)}
                  type="language"
                />
              </span>
            )}
            {activeTicket.contact.language && activeTicket.contact.timezone && (
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
            )}
            {activeTicket.contact.timezone && (
              <span>
                <CurrentTime timezone={activeTicket.contact.timezone} />
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
