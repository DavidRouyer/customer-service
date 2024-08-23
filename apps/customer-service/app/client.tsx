/// <reference types="vinxi/types/client" />

import React from 'react';

import './globals.css';

import { StartClient } from '@tanstack/start';
import { hydrateRoot } from 'react-dom/client';

import { createRouter } from './router';

const router = createRouter();

hydrateRoot(document.getElementById('root')!, <StartClient router={router} />);
