/// <reference types="vinxi/types/server" />
import { getRouterManifest } from '@tanstack/start/router-manifest';
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server';

import { createAuthjsHandler } from '~/middlewareHandler';
import { createRouter } from './router';

const handler = createStartHandler({
  createRouter,
  getRouterManifest,
});

const authjsHandler = createAuthjsHandler(handler);

export default authjsHandler(defaultStreamHandler);
