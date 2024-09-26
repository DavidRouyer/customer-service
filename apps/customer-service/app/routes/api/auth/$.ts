import { createAPIFileRoute } from '@tanstack/start/api'

import { Auth, authOptions } from '@kyaku/auth'

export const Route = createAPIFileRoute('/api/auth/$')({
  GET: async ({ request }) => {
    return Auth(request, authOptions)
  },
  POST: async ({ request }) => {
    return Auth(request, authOptions)
  },
})
