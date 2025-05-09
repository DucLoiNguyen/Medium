const flowbite = require('flowbite-react/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./node_modules/flowbite/**/*.js",
    flowbite.content()
  ],
  theme: {
    extend: {},
    fontFamily: {
      'customs': ['sohne', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      'customs2': ['source-serif-pro', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif']
    }
  },
  plugins: [
    // require('flowbite/plugin')
    flowbite.plugin()
  ],
}

