/// <reference types="vinxi/types/client" />

import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';

import { createRouter } from './router';

// Set up a Router instance
const router = createRouter();

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
