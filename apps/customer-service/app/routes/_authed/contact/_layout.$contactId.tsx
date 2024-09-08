import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/_authed/contact/_layout/$contactId')({
  params: {
    parse: (params) => ({
      contactId: z.string().parse(String(params.contactId)),
    }),
    stringify: ({ contactId }) => ({ contactId: `${contactId}` }),
  },
  component: () => {
    const params = Route.useParams();
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {params.contactId}
        </h2>
      </div>
    );
  },
});
