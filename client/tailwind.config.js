module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ['IBM Plex Sans'],
      },
      colors: {
        blue: {
          100: "#cce4f6",
          200: "#99c9ed",
          300: "#66afe5",
          400: "#3394dc",
          500: "#0079d3",
          600: "#0061a9",
          700: "#00497f",
          800: "#003054",
          900: "#00182a",
        },
      },
      spacing: {
        70: '17.5rem',
        160: '40rem'
      },
      container: false // igy ervenytelenitettuk az alap container classt es a pluginban megirhatjuk a sajatunkat!!!
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'], // ha extra stateket is akarunk pl hoveren kivul, akkor itt lehet hozzaadni. A disabled ilyen extra statet. 
      // fontos, hogy minden propertihez hozza kell adni amit igy akarunk modositani!!!!borderColor: 
      borderColor: ['disabled'] 
    },
  },
  plugins: [
    // ez fogja a reddit oldalt kozepre centralni egy containerbe
    function({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': { maxWidth: '640px' },
          '@screen md': { maxWidth: '768px' },
          '@screen lg': { maxWidth: '975px' },
        }
      })
    }
  ],
}
