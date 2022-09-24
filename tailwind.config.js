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
      sans: ["Roboto"],
      head: ["Montserrat", "Roboto"],
    },
  },
  plugins: [],
};
