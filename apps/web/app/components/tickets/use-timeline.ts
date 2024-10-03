import { useTicketTimelineQuery } from '~/graphql/generated/client';

export const useTimeline = (ticketId: string) => {
  const timeline = useTicketTimelineQuery(
    {
      ticketId: ticketId,
    },
    {
      select: (data) => data.ticket?.timelineEntries,
    },
  );

  return timeline;
};
