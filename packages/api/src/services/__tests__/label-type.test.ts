import { and, asc, eq, isNull, schema } from '@cs/database';
import type { LabelTypeRepository } from '@cs/database';

import type { UnitOfWork } from '../../unit-of-work';
import { LabelTypeService } from '../label-type';

describe('LabelTypeService', () => {
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
    const labelTypeRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
      })),
    };

    const labelTypeService = new LabelTypeService({
      unitOfWork: {} as unknown as UnitOfWork,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
    });

    it('successfully retrieves a label type', async () => {
      const result = await labelTypeService.retrieve('one-piece');

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.id, 'one-piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result?.id).toEqual('one-piece');
    });
  });

  describe('retrieveByName', () => {
    const labelTypeRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        name: 'One Piece',
      })),
    };

    const labelTypeService = new LabelTypeService({
      unitOfWork: {} as unknown as UnitOfWork,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
    });

    it('successfully retrieves a label type by name', async () => {
      const result = await labelTypeService.retrieveByName('One Piece');

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.name, 'One Piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result?.id).toEqual('one-piece');
    });
  });

  describe('list', () => {
    const labelTypeRepo = {
      findMany: vi.fn(() => [
        {
          id: 'one-piece',
        },
      ]),
    };

    const labelTypeService = new LabelTypeService({
      unitOfWork: {} as unknown as UnitOfWork,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
    });

    it('successfully retrieves a list of label types', async () => {
      const result = await labelTypeService.list();

      expect(labelTypeRepo.findMany).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.findMany).toHaveBeenCalledWith({
        limit: 50,
        orderBy: [asc(schema.labelTypes.name), asc(schema.labelTypes.id)],
        where: and(and(isNull(schema.labelTypes.archivedAt))),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(result).toStrictEqual([{ id: 'one-piece' }]);
    });
  });

  describe('create', () => {
    it('should successfully create a label type', async () => {
      const labelTypeRepo = {
        find: vi.fn(() => undefined),
        create: vi.fn(() => ({
          id: 'one-piece',
        })),
      };
      const unitOfWork = {
        transaction: vi.fn((cb: () => void) => cb()),
      };

      const labelTypeService = new LabelTypeService({
        unitOfWork: unitOfWork as unknown as UnitOfWork,
        labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
      });

      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelTypeService.create(
        {
          name: 'One Piece',
          icon: 'icon',
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.name, 'One Piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(labelTypeRepo.create).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.create).toHaveBeenCalledWith(
        {
          name: 'One Piece',
          icon: 'icon',
          createdAt: new Date('2000-01-01T12:00:00.000Z'),
          createdById: 'user-id',
        },
        undefined
      );
    });

    it('should throw if a label type with the same name already exists', async () => {
      const labelTypeRepo = {
        find: vi.fn(() => ({
          id: 'one-piece',
        })),
      };
      const unitOfWork = {
        transaction: vi.fn((cb: () => void) => cb()),
      };

      const labelTypeService = new LabelTypeService({
        unitOfWork: unitOfWork as unknown as UnitOfWork,
        labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
      });

      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await expect(
        async () =>
          await labelTypeService.create(
            {
              name: 'One Piece',
              icon: 'icon',
            },
            'user-id'
          )
      ).rejects.toThrowError(/Label type with name:One Piece already exists/);

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(0);

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.name, 'One Piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });
    });
  });

  describe('update', () => {
    it('should successfully update a label type', async () => {
      const labelTypeRepo = {
        find: vi.fn(() => ({
          id: 'one-piece',
        })),
        update: vi.fn(() => ({
          id: 'one-piece',
        })),
      };
      const unitOfWork = {
        transaction: vi.fn((cb: () => void) => cb()),
      };

      const labelTypeService = new LabelTypeService({
        unitOfWork: unitOfWork as unknown as UnitOfWork,
        labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
      });

      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelTypeService.update(
        {
          id: 'one-piece',
          icon: 'new-icon',
        },
        'user-id'
      );

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.id, 'one-piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(labelTypeRepo.update).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          icon: 'new-icon',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
        },
        undefined
      );
    });

    it('should throw if a label type with the same name already exists', async () => {
      const labelTypeRepo = {
        find: vi.fn(() => ({
          id: 'one-piece-1',
        })),
      };
      const unitOfWork = {
        transaction: vi.fn((cb: () => void) => cb()),
      };

      const labelTypeService = new LabelTypeService({
        unitOfWork: unitOfWork as unknown as UnitOfWork,
        labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
      });

      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await expect(
        async () =>
          await labelTypeService.update(
            {
              id: 'one-piece',
              name: 'One Piece',
              icon: 'new-icon',
            },
            'user-id'
          )
      ).rejects.toThrowError(/Label type with name:One Piece already exists/);

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(0);

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(2);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.id, 'one-piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.name, 'One Piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });
    });
  });

  describe('archive', () => {
    const labelTypeRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const labelTypeService = new LabelTypeService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
    });

    it('should successfully archive a label type', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelTypeService.archive('one-piece', 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.id, 'one-piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(labelTypeRepo.update).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
          archivedAt: new Date('2000-01-01T12:00:00.000Z'),
        },
        undefined
      );
    });
  });

  describe('unarchive', () => {
    const labelTypeRepo = {
      find: vi.fn(() => ({
        id: 'one-piece',
        archivedAt: new Date('2000-01-01T12:00:00.000Z'),
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb: () => void) => cb()),
    };

    const labelTypeService = new LabelTypeService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
    });

    it('should successfully unarchive a label type', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelTypeService.unarchive('one-piece', 'user-id');

      expect(unitOfWork.transaction).toHaveBeenCalledTimes(1);

      expect(labelTypeRepo.find).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labelTypes.id, 'one-piece'),
        with: {
          createdBy: undefined,
          updatedBy: undefined,
        },
      });

      expect(labelTypeRepo.update).toHaveBeenCalledTimes(1);
      expect(labelTypeRepo.update).toHaveBeenCalledWith(
        {
          id: 'one-piece',
          updatedAt: new Date('2000-01-01T12:00:00.000Z'),
          updatedById: 'user-id',
          archivedAt: null,
        },
        undefined
      );
    });
  });
});
