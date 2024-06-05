import type { DrizzleConnection } from '@cs/database';

import type { DrizzleTransactionScope } from './drizzle-transaction';

export class UnitOfWork {
  private readonly _drizzleConnection: DrizzleConnection;

  constructor({ drizzleConnection }: { drizzleConnection: DrizzleConnection }) {
    this._drizzleConnection = drizzleConnection;
  }

  transaction<T>(
    transaction: (tx: DrizzleTransactionScope) => Promise<T>,
    config?: Parameters<(typeof this._drizzleConnection)['transaction']>[1]
  ): Promise<T> {
    return this._drizzleConnection.transaction(transaction, config);
  }
}
