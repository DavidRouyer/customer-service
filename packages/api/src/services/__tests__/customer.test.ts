import { eq, schema } from '@cs/database';

import CustomerRepository from '../../repositories/customer';
import { UnitOfWork } from '../../unit-of-work';
import CustomerService from '../customer';

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
        id: 'one-piece',
      })),
    };

    const customerService = new CustomerService({
      unitOfWork: {} as unknown as UnitOfWork,
      customerRepository: customerRepo as unknown as CustomerRepository,
    });

    it('successfully retrieves a customer', async () => {
      const result = await customerService.retrieve('one-piece');

      expect(customerRepo.find).toHaveBeenCalledTimes(1);
      expect(customerRepo.find).toHaveBeenCalledWith({
        where: eq(schema.customers.id, 'one-piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result.id).toEqual('one-piece');
    });
  });
});
