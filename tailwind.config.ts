import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        slate: "#5d6679",
        paper: "#f7f8fb",
        line: "#d9deea",
      },
    },
  },
  plugins: [],
};

export default config;
