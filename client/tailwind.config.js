/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#202520',
        secondary: '#98ff98',
        accent: '#b8ffb8'
      },
      components: {
        header: 'block fixed w-full h-[70px] top-0 z-[9999]'
      }
    },
  },
  plugins: [],
}

