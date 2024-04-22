import { Resolvers } from '../../generated-types/graphql';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Query: {
    ticket: async (_, { id }, { dataloaders }) => {
      try {
        const ticket = await dataloaders.ticketLoader.load(id);
        return {
          ...ticket,
          assignedTo: ticket.assignedToId ? { id: ticket.assignedToId } : null,
          customer: { id: ticket.customerId },
          createdBy: {
            id: ticket.createdById,
          },
          statusChangedBy: ticket.statusChangedById
            ? { id: ticket.statusChangedById }
            : null,
          updatedBy: ticket.updatedById
            ? {
                id: ticket.updatedById,
              }
            : null,
        };
      } catch (error) {
        return null;
      }
    },
  },
  Ticket: {
    assignedTo: async ({ assignedTo }, _, { dataloaders }) => {
      if (!assignedTo) {
        return null;
      }
      return dataloaders.userLoader.load(assignedTo.id);
    },
    createdBy: async ({ createdBy }, _, { dataloaders }) => {
      return dataloaders.userLoader.load(createdBy.id);
    },
    customer: async ({ customer }, _, { dataloaders }) => {
      return dataloaders.userLoader.load(customer.id);
    },
    statusChangedBy: async ({ statusChangedBy }, _, { dataloaders }) => {
      if (!statusChangedBy) {
        return null;
      }
      return dataloaders.userLoader.load(statusChangedBy.id);
    },
    updatedBy: async ({ updatedBy }, _, { dataloaders }) => {
      if (!updatedBy) {
        return null;
      }
      return dataloaders.userLoader.load(updatedBy.id);
    },
  },
};

export const ticketModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
