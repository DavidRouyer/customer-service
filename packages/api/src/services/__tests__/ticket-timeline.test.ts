import { asc, eq, schema } from '@cs/database';
import type { TicketTimelineRepository } from '@cs/database';
import { TimelineEntryType } from '@cs/kyaku/models';

import type { UnitOfWork } from '../../unit-of-work';
import { TicketTimelineService } from '../ticket-timeline';

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
          type: TimelineEntryType.Chat,
          entry: {
            text: 'Hello, world!',
          },
        },
      ]),
    };

    const ticketTimelineService = new TicketTimelineService({
      unitOfWork: {} as unknown as UnitOfWork,
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('successfully retrieves a list of timeline entries', async () => {
      const result = await ticketTimelineService.list({
        ticketId: 'john-doe',
      });

      expect(ticketTimelineRepo.findMany).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.findMany).toHaveBeenCalledWith({
        limit: 50,
        orderBy: [
          asc(schema.ticketTimelineEntries.createdAt),
          asc(schema.ticketTimelineEntries.id),
        ],
        where: eq(schema.ticketTimelineEntries.ticketId, 'john-doe'),
        with: {
          customer: undefined,
          customerCreatedBy: undefined,
          ticket: undefined,
          userCreatedBy: undefined,
        },
      });

      expect(result).toStrictEqual([
        { id: 'john-doe', entry: { text: 'Hello, world!' }, type: 'CHAT' },
      ]);
    });
  });
});
