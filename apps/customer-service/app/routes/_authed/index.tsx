import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/')({
  component: () => <div>Hello /!</div>,
});
