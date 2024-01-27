import { eq, schema } from '@cs/database';

import UserRepository from '../../repositories/user';
import { UnitOfWork } from '../../unit-of-work';
import UserService from '../user';

describe('UserService', () => {
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
    const userRepo = {
      find: vi.fn(() => ({
        id: 'john-doe',
      })),
    };

    const userService = new UserService({
      unitOfWork: {} as unknown as UnitOfWork,
      userRepository: userRepo as unknown as UserRepository,
    });

    it('successfully retrieves a user', async () => {
      const result = await userService.retrieve('john-doe');

      expect(userRepo.find).toHaveBeenCalledTimes(1);
      expect(userRepo.find).toHaveBeenCalledWith({
        columns: {
          email: true,
          emailVerified: true,
          id: true,
          image: true,
          name: true,
        },
        where: eq(schema.users.id, 'john-doe'),
      });

      expect(result.id).toEqual('john-doe');
    });
  });

  describe('list', () => {
    const userRepo = {
      findMany: vi.fn(() => [
        {
          id: 'john-doe',
        },
      ]),
    };

    const userService = new UserService({
      unitOfWork: {} as unknown as UnitOfWork,
      userRepository: userRepo as unknown as UserRepository,
    });

    it('successfully retrieves a list of users', async () => {
      const result = await userService.list({});

      expect(userRepo.findMany).toHaveBeenCalledTimes(1);
      expect(userRepo.findMany).toHaveBeenCalledWith({
        limit: undefined,
        columns: {
          email: true,
          emailVerified: true,
          id: true,
          image: true,
          name: true,
        },
        where: undefined,
      });

      expect(result).toStrictEqual([{ id: 'john-doe' }]);
    });
  });
});
