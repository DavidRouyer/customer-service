export type Contact = {
  id: number;
  createdAt: Date;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  language?: string | null;
  timezone?: string | null;
};
