module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mb': '400px',
      },
      colors: {
        customBlue: "#ECF6FF",
        blue: {
          primary: '#1B387E'
        }
      },
    },
    container: {
      center: true,
      padding: "2rem",
    },
    // Default project breakpoints
    // https://tailwindcss.com/docs/screens
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-dynamic": {
          fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
