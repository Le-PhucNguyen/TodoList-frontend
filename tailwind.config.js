/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        'light-purple': '#D1B3FF', // Adjust to your preferred light purple shade
        'primary-purple': '#7F3DFF', // Adjust to your preferred primary purple shade
        'dark-purple': '#2E026F', // If needed
      },
    },
  },
  plugins: [],
};
