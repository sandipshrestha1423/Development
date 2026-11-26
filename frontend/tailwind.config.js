export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d9488', 
          dark: '#0f766e',    
          light: '#ccfbf1',   
        },
        accent: '#10b981',    
      }
    },
  },
  plugins: [],
}