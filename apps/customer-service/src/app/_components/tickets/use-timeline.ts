import { api } from '~/trpc/react';

export const useTimeline = (ticketId: string) => {
  const timeline = api.ticketTimeline.byTicketId.useQuery({
    ticketId: ticketId,
  });

  return timeline;
};
