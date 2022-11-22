/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 'カラー名': 'カラーコード'
        dark: {
          900: "#151C30",
          850: "#1B2138",
          800: "#222642",
          700: "#303055",
          600: "#55586D",
          500: "#686A7F",
          400: "#7B7C91",
          300: "#8E8EA4",
          200: "#A1A0B6",
          100: "#B4B2C8",
        },
      },
      fontFamily: {
        Mincho: ["Shippori Mincho"],
        MinchoB1: ["Shippori Mincho B1"],
        Tangerine: ["Tangerine"],
        fancy: ["Dancing Script"],
      },
    },
  },
  plugins: [require("daisyui")],
};
