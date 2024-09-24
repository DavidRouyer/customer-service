import {
  and,
  asc,
  eq,
  LabelTypeRepository,
  schema,
  TicketRepository,
  TicketTimelineRepository,
} from '@cs/database';
import type { LabelRepository } from '@cs/database';

import type { UnitOfWork } from '../../unit-of-work';
import { LabelService } from '../label';

vi.mock('@cs/database', () => ({
  LabelTypeRepository: class LabelTypeRepository {},
  TicketRepository: class TicketRepository {},
  TicketTimelineRepository: class TicketTimelineRepository {},
}));

describe('LabelService', () => {
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
    const labelRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
      })),
    };

    const labelService = new LabelService({
      unitOfWork: {} as unknown as UnitOfWork,
      labelRepository: labelRepo as unknown as LabelRepository,
      labelTypeRepository: new LabelTypeRepository(),
      ticketRepository: new TicketRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    it('successfully retrieves a label', async () => {
      const result = await labelService.retrieve('one-piece');

      expect(labelRepo.find).toHaveBeenCalledTimes(1);
      expect(labelRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labels.id, 'one-piece'),
        with: {
          ticket: undefined,
          labelType: undefined,
        },
      });

      expect(result?.id).toEqual('one-piece');
    });
  });

  describe('list', () => {
    const labelRepo = {
      findMany: vi.fn(() => [
        {
          id: 'one-piece',
        },
      ]),
    };

    const labelService = new LabelService({
      unitOfWork: {} as unknown as UnitOfWork,
      labelRepository: labelRepo as unknown as LabelRepository,
      labelTypeRepository: new LabelTypeRepository(),
      ticketRepository: new TicketRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    it('successfully retrieves a list of labels', async () => {
      const result = await labelService.list();

      expect(labelRepo.findMany).toHaveBeenCalledTimes(1);
      expect(labelRepo.findMany).toHaveBeenCalledWith({
        limit: 50,
        orderBy: [asc(schema.labelTypes.id)],
        where: and(undefined),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result).toStrictEqual([{ id: 'one-piece' }]);
    });
  });

  describe('addLabels', () => {
    const labelRepo = {
      createMany: vi.fn(() => [
        {
          id: 'label-1',
        },
      ]),
    };
    const labelTypeRepo = {
      findMany: vi.fn(() => [
        {
          id: 'label-type-1',
          name: 'Label Type 1',
        },
        {
          id: 'label-type-2',
          name: 'Label Type 2',
        },
      ]),
    };
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
        labels: [],
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

    const labelService = new LabelService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      labelRepository: labelRepo as unknown as LabelRepository,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully add labels', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelService.addLabels('one-piece', ['label-type-1'], 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(ticketRepo.update).toHaveBeenCalledTimes(1);
      expect(ticketRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
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
          type: 'LABELS_CHANGED',
          entry: {
            newLabelIds: ['label-1'],
            oldLabelIds: [],
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('removeLabels', () => {
    const labelRepo = {
      findMany: vi.fn(() => [
        {
          id: 'label-1',
          labelType: {
            id: 'label-type-1',
          },
        },
      ]),
      updateMany: vi.fn(() => [
        {
          id: 'label-1',
        },
      ]),
    };
    const labelTypeRepo = {
      findMany: vi.fn(() => [
        {
          id: 'label-type-1',
          name: 'Label Type 1',
        },
        {
          id: 'label-type-2',
          name: 'Label Type 2',
        },
      ]),
    };
    const ticketRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        title: 'One Piece',
        labels: [],
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

    const labelService = new LabelService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      labelRepository: labelRepo as unknown as LabelRepository,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
      ticketRepository: ticketRepo as unknown as TicketRepository,
      ticketTimelineRepository:
        ticketTimelineRepo as unknown as TicketTimelineRepository,
    });

    it('should successfully remove labels', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelService.removeLabels('one-piece', ['label-1'], 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(labelRepo.updateMany).toHaveBeenCalledTimes(1);
      expect(labelRepo.updateMany).toHaveBeenCalledWith(
        ['label-1'],
        {
          archivedAt: new Date('2000-01-01T12:00:00.000Z'),
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

      expect(ticketTimelineRepo.create).toHaveBeenCalledTimes(1);
      expect(ticketTimelineRepo.create).toHaveBeenCalledWith(
        {
          ticketId: 'one-piece',
          customerId: undefined,
          type: 'LABELS_CHANGED',
          entry: {
            newLabelIds: [],
            oldLabelIds: ['label-1'],
          },
          userCreatedById: 'user-id',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });
});
