import type { DbConnection, DbTransactionScope } from '@kyaku/database';

export class UnitOfWork {
  private readonly _dbConnection: DbConnection;

  constructor({ dbConnection }: { dbConnection: DbConnection }) {
    this._dbConnection = dbConnection;
  }

  transaction<T>(
    transaction: (tx: DbTransactionScope) => Promise<T>,
    config?: Parameters<(typeof this._dbConnection)['transaction']>[1],
  ): Promise<T> {
    return this._dbConnection.transaction(transaction, config);
  }
}
