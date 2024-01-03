import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /*
        text: '#c8c8c8',
        background: '#0c0d24',
        primary: '#243392',
        secondary: '#2f314b',
        accent: '#ddb814',
        accentRed: '#dd2814',
        accentGreen: '#28dd14',
        accentBlue: '#1428dd',
        primary: '#15183b',
        */
        text: '#000000',
        background: '#e5ebf5',
        primary: '#96a8c9',
        secondary: '#b7c2d6',

        dark_text: '#c8c8c8',
        dark_background: '#0c0d24',
        dark_primary: '#15183b',
        dark_secondary: '#2f314b',

        gray: '#c8c8c8',
        accent: '#d79e00',
        accentRed: '#dd2814',
        accentGreen: '#28dd14',
        accentBlue: '#1428dd',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
