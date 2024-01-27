import { eq, schema } from '@cs/database';

import LabelRepository from '../../repositories/label';
import TicketTimelineRepository from '../../repositories/ticket-timeline';
import UserRepository from '../../repositories/user';
import { UnitOfWork } from '../../unit-of-work';
import TicketTimelineService from '../ticket-timeline';

vi.mock('../../repositories/label');
vi.mock('../../repositories/user');

describe('TicketTimelineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
  });

  describe('list', () => {
    const ticketTimelineRepo = {
      findMany: vi.fn(() => [
        {
          id: 'john-doe',
        },
      ]),
    };

    const ticketTimelineService = new TicketTimelineService({
      unitOfWork: {} as unknown as UnitOfWork,
      labelRepository: new LabelRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
      userRepository: new UserRepository(),
    });

    it('successfully retrieves a list of timeline entries', async () => {
      const result = await ticketTimelineService.list({
        ticketId: 'john-doe',
      });

      expect(ticketTimelineRepo.findMany).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.findMany).toHaveBeenCalledWith({
        limit: undefined,
        where: eq(schema.ticketTimelineEntries.ticketId, 'john-doe'),
        with: {
          customer: undefined,
          customerCreatedBy: undefined,
          ticket: undefined,
          userCreatedBy: undefined,
        },
      });

      expect(result).toStrictEqual([{ id: 'john-doe' }]);
    });
  });
});
