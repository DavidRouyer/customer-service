import { AwilixContainer } from 'awilix';
import DataLoader from 'dataloader';

import { Session } from '@cs/auth';
import { User } from '@cs/kyaku/models';

import { Customer } from '../entities/customer';
import { Label } from '../entities/label';
import { LabelType } from '../entities/label-type';
import { Ticket } from '../entities/ticket';

export type Context = {
  container: AwilixContainer;
  dataloaders: {
    customerLoader: DataLoader<string, Customer, string>;
    labelLoader: DataLoader<string, Label, string>;
    labelTypeLoader: DataLoader<string, LabelType, string>;
    ticketLoader: DataLoader<string, Ticket, string>;
    userLoader: DataLoader<string, User, string>;
  };
  session: Session | null;
};
