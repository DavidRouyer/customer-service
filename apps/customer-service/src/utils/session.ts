import { auth } from '@cs/auth';
import { db, eq, schema } from '@cs/database';

export async function getCurrentUser() {
  const session = await auth();

  if (!session) {
    return null;
  }

  // TODO: refactor when auth session callback works
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  });

  return {
    ...session?.user,
    contactId: user?.contactId,
  };
}
