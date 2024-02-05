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
      keyframes: {
        slideIn: {
          from: { right: '-250px' },
          to: { right: '0' },
        },
        resultSlide: {
          '0%, 85%': {
            opacity: '0',
            transform: 'translateX(-200px) translateY(0px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0px) translateY(0px)',
          },
        },
        dCardSlide: {
          from: { opacity: '0', transform: 'translateX(2500px) translateY(-1000px)' },
          to: { opacity: '1', transform: 'translateX(0px) translateY(0px)' },
        },
        pCardSlide: {
          from: { opacity: '0', transform: 'translateX(700px) translateY(-1000px)' },
          to: { opacity: '1', transform: 'translateX(0px) translateY(0px)' },
        },
        notiBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '95%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        coinsPlus: {
          '0%': { color: 'rgb(200, 200, 200)' },
          '100%': { color: '#28dd14' },
        },
        coinsMinus: {
          '0%': { color: 'rgb(200, 200, 200)' },
          '100%': { color: '#dd2814' },
        },
        shine: {
          '0%': { transform: 'scale(0.5) rotate(0deg)', opacity: '1' },
          '20%': { opacity: '0', transform: 'scale(1) rotate(160deg)' },
          '100%': { opacity: '0', transform: 'scale(1) rotate(160deg)' },
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s forwards',
        'slide-in-result': 'resultSlide 3.3s ease forwards',
        'd-card': 'dCardSlide 1s ease forwards',
        'p-card': 'pCardSlide 1s ease forwards',
        'noti-bounce': 'notiBounce 0.3s alternate',
        'card-flip': 'cardFlip 1s linear forwards',
        'coins-plus': 'coinsPlus 1s alternate',
        'coins-minus': 'coinsMinus 1s alternate',
        'medal-shine': 'shine 5s alternate infinite',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
