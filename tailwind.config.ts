import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#d6e1ff',
          200: '#b3c5ff',
          300: '#8ca3ff',
          400: '#6a84ff',
          500: '#4d68f5',
          600: '#354ed8',
          700: '#283bb3',
          800: '#1f2d8c',
          900: '#1a266f'
        }
      }
    }
  },
  plugins: []
};

export default config;
