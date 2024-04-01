import type { Preview } from '@storybook/react'
import { Renderer } from 'react-dom';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName<Renderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    })
  ]
};

export default preview;