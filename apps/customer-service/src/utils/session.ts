import { auth } from '@cs/auth';

export async function getCurrentUser() {
  const session = await auth();

  return session?.user;
}
