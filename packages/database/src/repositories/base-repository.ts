import type { DbConnection } from '..';

export abstract class BaseRepository {
  protected readonly dbConnection: DbConnection;

  constructor({ dbConnection }: { dbConnection: DbConnection }) {
    this.dbConnection = dbConnection;
  }
}
