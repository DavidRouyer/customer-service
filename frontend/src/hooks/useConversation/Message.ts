export type Message = {
  id: number;
  user: {
    name: string;
    imageUrl: string;
    isAgent: boolean;
  };
  content: string | string[];
  createdAt: string;
};
