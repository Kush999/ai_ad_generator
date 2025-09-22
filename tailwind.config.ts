import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "hsl(var(--brand))",
        "brand-foreground": "hsl(var(--brand-foreground))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        // New color palette from image
        "dark-blue": "#21418a",
        "vibrant-red": "#e03a2e", 
        "golden-yellow": "#f9c62e",
        "cream": "#f5f2ed",
      },
      animation: {
        'appear': 'appear 0.5s ease-out forwards',
        'appear-zoom': 'appear-zoom 0.8s ease-out forwards',
      },
      keyframes: {
        'appear': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        'appear-zoom': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.98)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
