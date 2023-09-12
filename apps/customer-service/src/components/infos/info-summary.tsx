import { FC } from 'react';
import { FormattedDisplayName } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { CurrentTime } from '~/components/ui/current-time';
import { api } from '~/utils/api';
import { getInitials } from '~/utils/string';

export const InfoSummary: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({
    id: ticketId,
  });

  if (!ticketData) {
    return null;
  }

  return (
    <div>
      <div className="flex space-x-3 border-b border-gray-900/5 pb-6">
        <div className="shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={ticketData.author.avatarUrl ?? undefined} />
            <AvatarFallback>
              {getInitials(ticketData.author.name ?? '')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a href="#" className="hover:underline">
              {ticketData.author.name}
            </a>
          </p>
          <p className="flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
            {ticketData.author.language && (
              <span>
                <FormattedDisplayName
                  value={ticketData.author.language.substring(0, 2)}
                  type="language"
                />
              </span>
            )}
            {ticketData.author.language && ticketData.author.timezone && (
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
            )}
            {ticketData.author.timezone && (
              <span>
                <CurrentTime timezone={ticketData.author.timezone} />
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
