import { eq, schema } from '@cs/database';

import LabelRepository from '../../repositories/label';
import TicketRepository from '../../repositories/ticket';
import TicketTimelineRepository from '../../repositories/ticket-timeline';
import { UnitOfWork } from '../../unit-of-work';
import LabelService from '../label';
import LabelTypeService from '../label-type';
import TicketService from '../ticket';

vi.mock('../../repositories/ticket');
vi.mock('../../services/ticket');

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
      ticketRepository: new TicketRepository(),
      ticketTimelineRepository: new TicketTimelineRepository(),
    });

    it('successfully retrieves a ticket', async () => {
      const result = await labelService.retrieve('one-piece');

      expect(labelRepo.find).toHaveBeenCalledTimes(1);
      expect(labelRepo.find).toHaveBeenCalledWith({
        where: eq(schema.labels.id, 'one-piece'),
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
});
