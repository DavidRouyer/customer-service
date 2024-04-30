import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { asClass, asValue, createContainer } from 'awilix';
import DataLoader from 'dataloader';

import { auth } from '@cs/auth';
import { drizzleConnection } from '@cs/database';
import { User } from '@cs/kyaku/models';

import { Customer } from './entities/customer';
import { Label } from './entities/label';
import { LabelType } from './entities/label-type';
import { Ticket } from './entities/ticket';
import { commonModule } from './modules/common/resolvers';
import { customerModule } from './modules/customer/resolvers';
import { labelTypeModule } from './modules/label-type/resolvers';
import { labelModule } from './modules/label/resolvers';
import { ticketModule } from './modules/ticket/resolvers';
import { userModule } from './modules/user/resolvers';
import CustomerRepository from './repositories/customer';
import LabelRepository from './repositories/label';
import LabelTypeRepository from './repositories/label-type';
import TicketRepository from './repositories/ticket';
import TicketMentionRepository from './repositories/ticket-mention';
import TicketTimelineRepository from './repositories/ticket-timeline';
import UserRepository from './repositories/user';
import CustomerService from './services/customer';
import LabelService from './services/label';
import LabelTypeService from './services/label-type';
import TicketService from './services/ticket';
import TicketTimelineService from './services/ticket-timeline';
import UserService from './services/user';
import { UnitOfWork } from './unit-of-work';

const container = createContainer();
container.register({
  drizzleConnection: asValue(drizzleConnection),
  unitOfWork: asClass(UnitOfWork).scoped(),
  customerRepository: asClass(CustomerRepository).scoped(),
  labelRepository: asClass(LabelRepository).scoped(),
  labelTypeRepository: asClass(LabelTypeRepository).scoped(),
  ticketRepository: asClass(TicketRepository).scoped(),
  ticketMentionRepository: asClass(TicketMentionRepository).scoped(),
  ticketTimelineRepository: asClass(TicketTimelineRepository).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  customerService: asClass(CustomerService).scoped(),
  labelTypeService: asClass(LabelTypeService).scoped(),
  labelService: asClass(LabelService).scoped(),
  ticketService: asClass(TicketService).scoped(),
  ticketTimelineService: asClass(TicketTimelineService).scoped(),
  userService: asClass(UserService).scoped(),
});

const getContext = async () => ({
  container,
  session: await auth(),
  dataloaders: {
    customerLoader: new DataLoader<string, Customer, string>(async (ids) => {
      const customerService: CustomerService =
        container.resolve('customerService');
      const rows = await customerService.list({
        customerIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) || new Error(`Row not found: ${id}`)
      );
    }),
    labelLoader: new DataLoader<string, Label, string>(async (ids) => {
      const labelService: LabelService = container.resolve('labelService');
      const rows = await labelService.list({
        labelIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) || new Error(`Row not found: ${id}`)
      );
    }),
    labelTypeLoader: new DataLoader<string, LabelType, string>(async (ids) => {
      const labelTypeService: LabelTypeService =
        container.resolve('labelTypeService');
      const rows = await labelTypeService.list({
        labelTypeIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) || new Error(`Row not found: ${id}`)
      );
    }),
    ticketLoader: new DataLoader<string, Ticket, string>(async (ids) => {
      const ticketService: TicketService = container.resolve('ticketService');
      const rows = await ticketService.list({
        ticketIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) || new Error(`Row not found: ${id}`)
      );
    }),
    userLoader: new DataLoader<string, User, string>(async (ids) => {
      const userService: UserService = container.resolve('userService');
      const rows = await userService.list({
        userIds: {
          in: [...ids],
        },
      });
      return ids.map(
        (id) =>
          rows.find((row) => row.id === id) || new Error(`Row not found: ${id}`)
      );
    }),
  },
});

const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    commonModule.typeDefs,
    customerModule.typeDefs,
    labelModule.typeDefs,
    labelTypeModule.typeDefs,
    ticketModule.typeDefs,
    userModule.typeDefs,
  ]),
  resolvers: mergeResolvers([
    commonModule.resolvers,
    customerModule.resolvers,
    labelModule.resolvers,
    labelTypeModule.resolvers,
    ticketModule.resolvers,
    userModule.resolvers,
  ]),
});

export { getContext, schema };
