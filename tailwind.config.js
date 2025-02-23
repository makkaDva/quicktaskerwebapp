/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      }
      
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

safelist: [
  { pattern: /bg-gradient-to-+/ },
  { pattern: /from-+/ },
  { pattern: /to-+/ },
  { pattern: /text-+/ },
  { pattern: /rounded-+/ },
]
