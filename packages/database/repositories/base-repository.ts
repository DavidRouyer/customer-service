import type { DbConnection } from '@cs/database';

export abstract class BaseRepository {
  protected readonly dbConnection: DbConnection;

  constructor({ dbConnection }: { dbConnection: DbConnection }) {
    this.dbConnection = dbConnection;
  }
}
