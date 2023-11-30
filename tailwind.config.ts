import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        text: '#c8c8c8',
        background: '#0c0d24',
        primary: '#243392',
        secondary: '#2f314b',
        accent: '#ddb814',
        accentRed: '#dd2814',
        accentGreen: '#28dd14',
        accentBlue: '#1428dd',
        secondary_bg: '#15183b',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
