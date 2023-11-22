'use server';

import { signOut } from '@cs/auth';

export async function handleSignOut() {
  await signOut({
    redirect: true,
    redirectTo: '/',
  });
}
