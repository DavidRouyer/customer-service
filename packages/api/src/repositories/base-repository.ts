import { DrizzleConnection } from '@cs/database';

export abstract class BaseRepository {
  protected readonly drizzleConnection: DrizzleConnection;

  constructor({ drizzleConnection }: { drizzleConnection: DrizzleConnection }) {
    this.drizzleConnection = drizzleConnection;
  }
}
