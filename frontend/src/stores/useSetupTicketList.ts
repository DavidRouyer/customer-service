import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { graphql } from '@/gql/gql';
import { useGraphQL } from '@/hooks/use-query';
import { ticketListState } from '@/stores/ticketList';

export const AllTicketsQuery = graphql(/* GraphQL */ `
  query allTickets {
    allTickets {
      id
      createdAt
      user {
        id
        imageUrl
        name
      }
      content
    }
  }
`);

export const useSetupTicketList = () => {
  const setTicketList = useSetRecoilState(ticketListState);

  const { data } = useGraphQL(AllTicketsQuery);

  useEffect(() => {
    setTicketList(data?.data?.allTickets ?? []);
  }, [data, setTicketList]);
};
