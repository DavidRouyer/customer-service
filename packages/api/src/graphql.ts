import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { asClass, asValue, createContainer } from 'awilix';
import DataLoader from 'dataloader';
import { YogaInitialContext } from 'graphql-yoga';
import { JwtPayload, verify } from 'jsonwebtoken';

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

type Services = {
  drizzleConnection: typeof drizzleConnection;
  unitOfWork: UnitOfWork;
  customerRepository: CustomerRepository;
  labelRepository: LabelRepository;
  labelTypeRepository: LabelTypeRepository;
  ticketRepository: TicketRepository;
  ticketMentionRepository: TicketMentionRepository;
  ticketTimelineRepository: TicketTimelineRepository;
  userRepository: UserRepository;
  customerService: CustomerService;
  labelService: LabelService;
  labelTypeService: LabelTypeService;
  ticketService: TicketService;
  ticketTimelineService: TicketTimelineService;
  userService: UserService;
};

const container = createContainer<Services>();
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

const getUser = async (request: Request) => {
  const session = await auth();
  if (session?.user) {
    return session.user;
  }

  const header = request.headers.get('authorization');
  if (header !== null) {
    const token = header.split(' ')[1];
    const tokenPayload = verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const userId = tokenPayload.userId;
    if (typeof userId !== 'string') {
      return null;
    }
    const userService = container.resolve('userService');
    return (await userService.retrieve(userId)) ?? null;
  }

  return null;
};

const getContext = async (initialContext: YogaInitialContext) => ({
  container,
  dataloaders: {
    customerLoader: new DataLoader<string, Customer, string>(async (ids) => {
      const customerService = container.resolve('customerService');
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
      const labelService = container.resolve('labelService');
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
      const labelTypeService = container.resolve('labelTypeService');
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
      const ticketService = container.resolve('ticketService');
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
      const userService = container.resolve('userService');
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
  user: await getUser(initialContext.request),
});

export type Context = Awaited<ReturnType<typeof getContext>>;

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
