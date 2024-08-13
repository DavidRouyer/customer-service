import { TicketStatus, useTicketsQuery } from '~/graphql/generated/client';

export const Test = () => {
  const { data } = useTicketsQuery({
    filters: {
      statuses: [TicketStatus.Open],
    },
  });

  return (
    <ul>{data?.tickets?.edges?.map((ticket) => <li>{ticket.node.id}</li>)}</ul>
  );
};
