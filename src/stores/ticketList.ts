import { atom } from 'recoil';

export type TicketSummary = {
  id: number;
  name: string;
  imageUrl: string;
  content: string;
  dateTime: string;
};

export const ticketListState = atom<TicketSummary[]>({
  key: 'TicketList',
  default: [],
});
