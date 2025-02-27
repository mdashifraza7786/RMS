import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#25476A",  //dark blue -- primary color
        primaryhover:"#193756",
        secondary: "#03A9F4",  //light blue
        supporting1: "#AB47BC",  //dark pink
        supporting2: "#9FCC2E", //green
        supporting3: "#FA9F1B",  //golden yellow
        bgred: "#FF0000"       // red
      }
    },
  },
  plugins: [],
};
export default config;
