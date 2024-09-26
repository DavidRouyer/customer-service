import { asc, eq, schema } from '@kyaku/database';
import type { CustomerRepository } from '@kyaku/database';

import type { UnitOfWork } from '../../unit-of-work';
import { CustomerService } from '../customer';

describe('CustomerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  describe('retrieve', () => {
    const customerRepo = {
      find: vi.fn(() => ({
        id: 'john-doe',
      })),
    };

    const customerService = new CustomerService({
      unitOfWork: {} as unknown as UnitOfWork,
      customerRepository: customerRepo as unknown as CustomerRepository,
    });

    it('successfully retrieves a customer', async () => {
      const result = await customerService.retrieve('john-doe');

      expect(customerRepo.find).toHaveBeenCalledTimes(1);
      expect(customerRepo.find).toHaveBeenCalledWith({
        where: eq(schema.customers.id, 'john-doe'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result?.id).toEqual('john-doe');
    });
  });

  describe('list', () => {
    const customerRepo = {
      findMany: vi.fn(() => [
        {
          id: 'john-doe',
        },
      ]),
    };

    const customerService = new CustomerService({
      unitOfWork: {} as unknown as UnitOfWork,
      customerRepository: customerRepo as unknown as CustomerRepository,
    });

    it('successfully retrieves a list of customers', async () => {
      const result = await customerService.list();

      expect(customerRepo.findMany).toHaveBeenCalledTimes(1);
      expect(customerRepo.findMany).toHaveBeenCalledWith({
        limit: 50,
        orderBy: [asc(schema.customers.createdAt), asc(schema.customers.id)],
        where: undefined,
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result).toStrictEqual([{ id: 'john-doe' }]);
    });
  });
});
