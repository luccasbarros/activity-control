import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        slate: "var(--color-slate)",
        paper: "var(--color-paper)",
        line: "var(--color-line)",
      },
    },
  },
  plugins: [],
};

export default config;
