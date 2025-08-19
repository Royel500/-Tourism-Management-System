/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // গুরুত্বপূর্ণ
  theme: {
    extend: {},
  },
 daisyui: {
  themes: ["light", "dark", "cupcake"], // Add themes you want to use
},
};
