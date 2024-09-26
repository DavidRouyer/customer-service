import type { DbConnection } from '@kyaku/database';

export abstract class BaseRepository {
  protected readonly dbConnection: DbConnection;

  constructor({ dbConnection }: { dbConnection: DbConnection }) {
    this.dbConnection = dbConnection;
  }
}
