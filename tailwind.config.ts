import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        text: '#c8c8c8',
        background: '#0c0d24',
        primary: '#243392',
        secondary: '#2f314b',
        accent: '#ddb814',
        secondary_bg: '#15183b',
      },
    },
  },
  plugins: [],
};
export default config;
