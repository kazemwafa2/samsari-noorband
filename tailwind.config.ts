import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        secondary: "#C084FC",
        gold: "#FBBF24",
        success: "#22C55E",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};

export default config;
