module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        pcard: "20ch", // width of credit card number with spaces in characters
      },
      keyframes: {
        fadeIn: {
          0: { opacity: "0" },
          "100%": { opacity: "1" },
        },
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
        fadeIn: "fadeIn 400ms ease-in-out",
        fadeInOut: "fadeInOut 4000ms ease-in-out infinite",
        fadeInOutBlank: "fadeInOutBlank 4000ms ease-in-out infinite",
      },
    },
    fontFamily: {
      mono: ['"Roboto Mono"'],
      sans: ["Geologica", "Montserrat"],
      head: ["Geologica", "Montserrat"],
    },
  },
  plugins: [],
};
