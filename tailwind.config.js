module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        pcard: "20ch", // width of credit card number with spaces in characters
      },
      keyframes: {
        fadeInOut: {
          "5%, 95%": { opacity: "1" },
          "20%, 80%": { opacity: "0" },
        },
        fadeInOutBlank: {
          "5%, 95%": { opacity: "0" },
          "20%, 80%": { opacity: "1" },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 4000ms ease-in-out infinite",
        fadeInOutBlank: "fadeInOutBlank 4000ms ease-in-out infinite",
      },
    },
    fontFamily: {
      // mono: ['"IBM Plex Mono"'],
      mono: ['"Roboto Mono"'],
      sans: ["Commissioner", "Montserrat"],
      head: ["Commissioner", "Montserrat"],
    },
  },
  plugins: [],
};
