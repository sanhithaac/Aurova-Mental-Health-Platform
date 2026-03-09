module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7D44",
        secondary: "#FFC82E",
        "aura-black": "#1A1A1A",
        "aura-cream": "#FAF9F6",
        "card-purple": "#E8DFF5",
        "card-yellow": "#FCEFB4",
        "card-orange": "#FF8C5F",
        "card-blue": "#AECFFF",
        "deep-grey": "#262626",
        "background-light": "#FAF9F6",
        "background-dark": "#121212",
        "card-dark": "#1E1E1E",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        hand: ["'Permanent Marker'", "cursive"],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #000',
        'retro-hover': '8px 8px 0px 0px #000',
        'retro-white': '4px 4px 0px 0px #FFF',
        'brutalist': '8px 8px 0px 0px #000',
        'brutalist-hover': '12px 12px 0px 0px #000',
        'brutalist-sm': '4px 4px 0px 0px #000',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};