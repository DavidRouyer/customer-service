import { DataSource } from '@cs/database';

export abstract class BaseRepository {
  protected readonly dataSource: DataSource;

  constructor({ dataSource }: { dataSource: DataSource }) {
    this.dataSource = dataSource;
  }
}
