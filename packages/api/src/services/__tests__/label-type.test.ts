import { eq, schema } from '@cs/database';

import LabelTypeRepository from '../../repositories/label-type';
import { UnitOfWork } from '../../unit-of-work';
import LabelTypeService from '../label-type';

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

      expect(result.id).toEqual('one-piece');
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

      expect(result.id).toEqual('one-piece');
    });
  });

  describe('create', () => {
    const labelTypeRepo = {
      find: vi.fn(() => null),
      create: vi.fn(() => ({
        id: 'one-piece',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb) => cb()),
    };

    const labelTypeService = new LabelTypeService({
      unitOfWork: unitOfWork as unknown as UnitOfWork,
      labelTypeRepository: labelTypeRepo as unknown as LabelTypeRepository,
    });

    it('should successfully create a label type', async () => {
      const date = new Date('2000-01-01T12:00:00.000Z');
      vi.setSystemTime(date);

      await labelTypeService.create({
        name: 'One Piece',
        icon: 'icon',
        createdById: 'user-id',
      });

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
      transaction: vi.fn((cb) => cb()),
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
      })),
      update: vi.fn(() => ({
        id: 'one-piece',
      })),
    };
    const unitOfWork = {
      transaction: vi.fn((cb) => cb()),
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
