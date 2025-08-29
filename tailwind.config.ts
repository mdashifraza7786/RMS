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
      screens: {
        'desktop1920': '1921px',
      },
      colors: {
        primary: "var(--color-primary)",
        primaryhover: "color-mix(in srgb, var(--color-primary), black 20%)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        supporting1: "#AB47BC",  //dark pink
        supporting2: "#9FCC2E", //green use (#0c9c18)
        supporting3: "#FA9F1B",  //golden yellow
        bgred: "#FF0000"       // red
      },
      backgroundColor: {
        card: "var(--card-bg)",
        input: "var(--input-bg)",
        hover: "var(--hover-bg)",
      },
      borderColor: {
        DEFAULT: "var(--border-color)",
        input: "var(--input-border)",
      },
      textColor: {
        DEFAULT: "var(--text-color)",
      }
    },
  },
  plugins: [],
};
export default config;
