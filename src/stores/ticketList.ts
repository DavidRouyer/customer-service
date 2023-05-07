import { atom } from 'recoil';

export type TicketSummary = {
  id: number;
  user: {
    name: string;
    imageUrl: string;
  };
  content: string;
  openingDate: string;
};

export const ticketListState = atom<TicketSummary[]>({
  key: 'TicketList',
  default: [],
});
