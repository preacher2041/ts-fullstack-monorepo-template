import type { Preview } from '@storybook/react-vite'
// @ts-ignore
import CssStyleSheet from '../../web/src/style.css?inline' with {type: 'css'};

const styleSheet = new CSSStyleSheet; styleSheet.replaceSync(CssStyleSheet);

const preview: Preview = {
  decorators: [
    (Story) => {
      document.adoptedStyleSheets = [styleSheet];
      return Story();
    }
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;