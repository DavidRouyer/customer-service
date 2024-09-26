import { queryOptions } from '@tanstack/react-query';

import { useTicketQuery } from '~/graphql/generated/client';

export const ticketQueryOptions = (ticketId: string) =>
  queryOptions({
    queryKey: useTicketQuery.getKey({ ticketId }),
    queryFn: () => useTicketQuery.fetcher({ ticketId }),
  });
