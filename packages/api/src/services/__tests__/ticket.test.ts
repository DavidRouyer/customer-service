import { and, asc, eq, schema } from '@cs/database';
import { TicketPriority, TicketStatus } from '@cs/kyaku/models';

import type TicketRepository from '../../repositories/ticket';
import TicketMentionRepository from '../../repositories/ticket-mention';
import TicketTimelineRepository from '../../repositories/ticket-timeline';
import type { UnitOfWork } from '../../unit-of-work';
import TicketService from '../ticket';

vi.mock('../../repositories/ticket-mention');
vi.mock('../../repositories/ticket-timeline');

describe('TicketService', () => {
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
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
      })),
    };

    const ticketService = new TicketService({
      unitOfWork: {} as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
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

      expect(result?.id).toEqual('one-piece');
    });
  });

  describe('list', () => {
    const ticketRepo = {
      findMany: vi.fn(() => [
        {
          id: 'one-piece',
        },
      ]),
    };

    const ticketService = new TicketService({
      unitOfWork: {} as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    it('successfully retrieves a list of tickets', async () => {
      const result = await ticketService.list();

      expect(ticketRepo.findMany).toHaveBeenCalledTimes(1);
      expect(ticketRepo.findMany).toHaveBeenCalledWith({
        limit: 50,
        orderBy: [asc(schema.tickets.createdAt), asc(schema.tickets.id)],
        where: and(undefined),
        with: {
          assignedTo: undefined,
          createdBy: undefined,
          customer: undefined,
          labels: undefined,
          updatedBy: undefined,
        },
      });

      expect(result).toStrictEqual([{ id: 'one-piece' }]);
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
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    it('should successfully create a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      const result = await ticketService.create(
        {
          title: 'One Piece',
          customerId: 'customer-id',
          priority: TicketPriority.Low,
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketRepo.create).toHaveBeenCalledWith(
        {
          title: 'One Piece',
          createdById: 'user-id',
          customerId: 'customer-id',
          priority: 'LOW',
          statusChangedById: 'user-id',
          status: 'OPEN',
          statusDetail: 'CREATED',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
          statusChangedAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );

      expect(result?.id).toEqual('one-piece');
    });
  });

  describe('assign', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        assignedToId: null,
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully assign a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.assign(
        {
          ticketId: 'one-piece',
          assignedToId: 'luffy',
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          assignedToId: 'luffy',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'ASSIGNMENT_CHANGED',
          entry: {
            newAssignedToId: 'luffy',
            oldAssignedToId: null,
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('unassign', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        assignedToId: 'luffy',
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully unassign a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.unassign('one-piece', 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          assignedToId: null,
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'ASSIGNMENT_CHANGED',
          entry: {
            newAssignedToId: null,
            oldAssignedToId: 'luffy',
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('changePriority', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        priority: null,
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully change priority a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.changePriority(
        {
          ticketId: 'one-piece',
          priority: TicketPriority.Critical,
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          priority: 'CRITICAL',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'PRIORITY_CHANGED',
          entry: {
            newPriority: 'CRITICAL',
            oldPriority: null,
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('createNote', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        status: TicketStatus.Done,
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
        createdAt: new Date('2000-01-01T12:00:00.000Z'),
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully send note on a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.createNote(
        {
          ticketId: 'one-piece',
          text: 'test chat',
          rawContent:
            '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"blabla","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'NOTE',
          entry: {
            rawContent:
              '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"blabla","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
            text: 'test chat',
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );
    });
  });

  describe('markAsDone', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        status: TicketStatus.Open,
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully mark as done a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.markAsDone('one-piece', 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          status: 'DONE',
          statusChangedAt: new Date('2000-01-01T12:00:00.000Z'),
          statusChangedById: 'user-id',
          statusDetail: null,
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'STATUS_CHANGED',
          entry: {
            newStatus: 'DONE',
            oldStatus: 'OPEN',
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('markAsOpen', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        status: TicketStatus.Done,
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully mark as open a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.markAsOpen('one-piece', 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          status: 'OPEN',
          statusChangedAt: new Date('2000-01-01T12:00:00.000Z'),
          statusChangedById: 'user-id',
          statusDetail: null,
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'STATUS_CHANGED',
          entry: {
            newStatus: 'OPEN',
            oldStatus: 'DONE',
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('sendChat', () => {
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        status: TicketStatus.Done,
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
      })),
    };
    const ticketTimelineRepo = {
      create: vi.fn(() => ({
        id: 'one-piece-timeline',
        createdAt: new Date('2000-01-01T12:00:00.000Z'),
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const ticketService = new TicketService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketMentionRepository: new TicketMentionRepository(),
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully send chat on a ticket', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await ticketService.sendChat(
        {
          ticketId: 'one-piece',
          text: 'test chat',
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'CHAT',
          entry: {
            text: 'test chat',
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          statusChangedAt: new Date('2000-01-01T12:00:00.000Z'),
          statusChangedById: 'user-id',
          statusDetail: 'REPLIED',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );
    });
  });
});
