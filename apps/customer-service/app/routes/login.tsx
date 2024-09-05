import { createFileRoute } from '@tanstack/react-router';

import { signIn } from '~/utils/sign-in';

export const Route = createFileRoute('/login')({
  component: () => (
    <div>
      Hello /login!
      <button
        type="button"
        onClick={() =>
          signIn({
            redirectUrl: window.location.origin,
          })
        }
      >
        sign in
      </button>
    </div>
  ),
});
