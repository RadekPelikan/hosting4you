const BaseSize = 16;

const rem = (px) => {
  return `${px / BaseSize}rem`;
};

const em = (px) => {
  return `${px / BaseSize}em`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    screens: {
      mobile: "400px",
      small: "640px",
      medium: "768px",
      large: "1024px",
      1280: "1280px",
      extraLarge: "1440px",
      largest: "1680px",
      1920: "1920px",
      tall: { raw: "(min-height: 650px)" },
    },
    extend: {
      colors: {
        primary: "hsla(215, 100%, 50%, 1)",
        "primary-dark": "hsla(215, 100%, 40%, 1)",
        secondary: "hsla(239, 62%, 30%, 1)",
        "secondary-light": "hsla(231, 77%, 56%, 1)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "10%",
        },
        screens: {
          mobile: "100%",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
