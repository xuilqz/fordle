module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'wordle': ['Clear Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'karnak': ['karnak'],
      },
      colors: {
        'wbackground': '#121213',
        'wborder': '#3a3a3c',
        'wcorrect': '#6aaa64',
        'wabsent': '#3a3a3c',
        'wbtnneutral': '#818384',
        'wbtncorrect': '#548d4e',
        'wbtnpresent': '#c9b458',
      }
    },
  },
  plugins: [],
}
