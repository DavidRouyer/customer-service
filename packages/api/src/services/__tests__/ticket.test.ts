import { eq, schema } from '@cs/database';
import { TicketPriority } from '@cs/kyaku/models';

import TicketMentionRepository from '../../repositories/ticket-mention';
import TicketTimelineRepository from '../../repositories/ticket-timeline';
import TicketService from '../ticket';

vi.mock('../../repositories/ticket-mention');
vi.mock('../../repositories/ticket-timeline');

describe('TicketService', () => {
  describe('retrieve', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
      })),
    };

    const ticketService = new TicketService({
      ticketRepository: ticketRepo as any,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('successfully retrieves a ticket', async () => {
      const result = await ticketService.retrieve('one-piece');

      expect(ticketRepo.find).toHaveBeenCalledTimes(1);
      expect(ticketRepo.find).toHaveBeenCalledWith({
        where: eq(schema.tickets.id, 'one-piece'),
        with: {
          assignedTo: undefined,
          createdBy: undefined,
          customer: undefined,
          labels: undefined,
          timelineEntries: undefined,
          updatedBy: undefined,
        },
      });

      expect(result.id).toEqual('one-piece');
    });
  });

  describe('create', () => {
    const ticketRepo = {
      create: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as any,
      ticketRepository: ticketRepo as any,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    beforeEach(() => {
      vi.clearAllMocks();
      // tell vitest we use mocked time
      vi.useFakeTimers();
    });

    afterEach(() => {
      // restoring date after each test run
      vi.useRealTimers();
    });

    it('should successfully create a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      const result = await ticketService.create({
        title: 'One Piece',
        createdById: 'user-id',
        customerId: 'customer-id',
        priority: TicketPriority.Low,
        statusChangedById: 'user-id',
      });

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketRepo.create).toHaveBeenCalledWith(
        {
          title: 'One Piece',
          createdById: 'user-id',
          customerId: 'customer-id',
          priority: 'Low',
          statusChangedById: 'user-id',
          status: 'Open',
          statusDetail: 'Created',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
          statusChangedAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );

      expect(result!.id).toEqual('one-piece');
    });
  });
});
