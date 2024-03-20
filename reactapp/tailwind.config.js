/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'customs': ['sohne', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      'customs2': ['source-serif-pro', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif']
    }
  },
  plugins: [],
}

