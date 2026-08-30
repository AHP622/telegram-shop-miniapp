/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "tg-bg": "var(--tg-theme-bg-color, #ffffff)",
        "tg-secondary-bg": "var(--tg-theme-secondary-bg-color, #f4f4f5)",
        "tg-text": "var(--tg-theme-text-color, #111111)",
        "tg-hint": "var(--tg-theme-hint-color, #999999)",
        "tg-link": "var(--tg-theme-link-color, #2481cc)",
        "tg-button": "var(--tg-theme-button-color, #2481cc)",
        "tg-button-text": "var(--tg-theme-button-text-color, #ffffff)",
      },
    },
  },
  plugins: [],
};
