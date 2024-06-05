import { auth } from '@cs/auth';

export async function getCurrentUser() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return session.user;
}
