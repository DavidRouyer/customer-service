import { RouterOutputs } from '@cs/api';

export type Ticket = NonNullable<RouterOutputs['ticket']['byId']>;
