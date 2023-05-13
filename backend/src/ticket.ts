export type Ticket = {
  id: number;
  user: {
    name: string;
    imageUrl: string;
  };
  content: string;
  openingDate: string;
};
