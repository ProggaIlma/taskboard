import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        status: {
          todo: "#3B82F6",
          inprogress: "#F59E0B",
          done: "#10B981",
        },
        priority: {
          low: "#10B981",
          medium: "#F59E0B",
          high: "#EF4444",
        },
      },
    },
  },
  plugins: [],
};

export default config;
