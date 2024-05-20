import { Resolvers, User } from '../../generated-types/graphql';
import CustomerService from '../../services/customer';
import typeDefs from './typeDefs';

export const mapCustomer = (
  customer: Awaited<ReturnType<CustomerService['list']>>[number]
) => {
  return {
    ...customer,
    createdBy: {
      id: customer.createdById,
    } as User,
    updatedBy: customer.updatedById
      ? ({
          id: customer.updatedById,
        } as User)
      : null,
  };
};

const resolvers: Resolvers = {
  Query: {
    customer: async (_, { id }, { dataloaders }) => {
      try {
        const customer = await dataloaders.customerLoader.load(id);
        return mapCustomer(customer);
      } catch (error) {
        return null;
      }
    },
  },
};

export const customerModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
