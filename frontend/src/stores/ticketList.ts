import { atom } from 'recoil';

import { Ticket } from '@/gql/graphql';

export const ticketListState = atom<Ticket[]>({
  key: 'TicketList',
  default: [],
});
