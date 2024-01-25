import { UnitOfWork } from '../unit-of-work';

export abstract class BaseService {
  protected readonly unitOfWork: UnitOfWork;

  constructor({ unitOfWork }: { unitOfWork: UnitOfWork }) {
    this.unitOfWork = unitOfWork;
  }
}
