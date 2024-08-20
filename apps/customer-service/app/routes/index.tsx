import { createFileRoute } from '@tanstack/react-router';

import { signIn } from '~/utils/sign-in';

export const Route = createFileRoute('/')({
  component: () => (
    <div>
      Hello /!
      <button type="button" onClick={() => signIn()}>
        sign in
      </button>
    </div>
  ),
});
