import { RouterOutputs } from '@cs/api';

export type Conversation = Record<
  string,
  Record<string, RouterOutputs['ticket']['conversation'][0][]>
>;
