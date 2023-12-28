import { DataSource } from '@cs/database';

export abstract class BaseService {
  protected readonly dataSource: DataSource;

  constructor({ dataSource }: { dataSource: DataSource }) {
    this.dataSource = dataSource;
  }
}
