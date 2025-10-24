/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#4F46E5',
          purple: '#6366F1',
          green: '#10B981',
          red: '#EF4444',
          orange: '#F59E0B',
        },
        opengov: {
          purple: '#6366F1',
          purpleDark: '#4F46E5',
          gray: '#6B7280',
          grayLight: '#F3F4F6',
        },
      },
    },
  },
  plugins: [],
}

