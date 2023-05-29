module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        pcard: "20ch", // width of credit card number with spaces in characters
      },
    },
    fontFamily: {
      // mono: ['"IBM Plex Mono"'],
      mono: ['"Roboto Mono"'],
      sans: ["Commissioner", "Montserrat"],
      head: ["Commissioner", "Montserrat"],

      // that is animation class
      animation: {
        fade: "0s ease-in-out 1s infinite fadeInOut",
      },

      // that is actual animation
      keyframes: (theme) => ({
        fadeInOut: {
          "0%": { opacity: 0.0 },
          "10%": { opacity: 1.0 },
          "90%": { opacity: 1.0 },
          "100%": { opacity: 0.0 },
        },
      }),
    },
  },
  plugins: [],
};
