import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design Tokens - MindEase Dark Mode Palette
        dark: {
          // Backgrounds
          bg: {
            primary: '#171717',      // Fundo principal escuro
            secondary: '#0F324A',    // Fundo secundário (azul escuro)
            tertiary: '#012326',     // Fundo terciário (verde escuro)
            elevated: '#1F1F1F',     // Cards e elementos elevados
            hover: '#252525',        // Estado hover
          },
          // Surfaces
          surface: {
            base: '#1F1F1F',
            muted: '#2A2A2A',
            subtle: '#333333',
          },
          // Text
          text: {
            primary: '#ECEAEC',      // Texto principal (cinza claro)
            secondary: '#92A9AC',    // Texto secundário (cinza-azulado)
            tertiary: '#9EB8D0',     // Texto terciário (azul claro)
            muted: '#6B7280',        // Texto desabilitado
            inverse: '#171717',      // Texto em fundos claros
          },
          // Borders
          border: {
            default: '#2A2A2A',
            subtle: '#1F1F1F',
            emphasis: '#3F3F3F',
            focus: '#92A9AC',
          },
          // Accent colors (derivadas da paleta principal)
          accent: {
            blue: {
              DEFAULT: '#0F324A',
              light: '#9EB8D0',
              dark: '#0A2335',
            },
            teal: {
              DEFAULT: '#012326',
              light: '#92A9AC',
              dark: '#011819',
            },
            neutral: {
              DEFAULT: '#ECEAEC',
              dark: '#92A9AC',
            },
          },
          // Status colors (mantendo acessibilidade)
          status: {
            success: {
              DEFAULT: '#10b981',
              light: '#34d399',
              dark: '#059669',
            },
            warning: {
              DEFAULT: '#f59e0b',
              light: '#fbbf24',
              dark: '#d97706',
            },
            error: {
              DEFAULT: '#ef4444',
              light: '#f87171',
              dark: '#dc2626',
            },
            info: {
              DEFAULT: '#3b82f6',
              light: '#60a5fa',
              dark: '#2563eb',
            },
          },
        },
        // Cores de categoria (mantidas para compatibilidade)
        category: {
          life: '#ef4444',
          health: '#10b981',
          study: '#3b82f6',
          work: '#f59e0b',
          finance: '#8b5cf6',
          home: '#ec4899',
          social: '#14b8a6',
          hobby: '#f97316',
          fitness: '#06b6d4',
          mindfulness: '#a855f7',
          creativity: '#eab308',
          other: '#6b7280',
        },
      },
      backgroundColor: {
        'dark-primary': '#171717',
        'dark-secondary': '#0F324A',
        'dark-tertiary': '#012326',
      },
      textColor: {
        'dark-primary': '#ECEAEC',
        'dark-secondary': '#92A9AC',
        'dark-tertiary': '#9EB8D0',
      },
      borderColor: {
        'dark-default': '#2A2A2A',
        'dark-subtle': '#1F1F1F',
        'dark-emphasis': '#3F3F3F',
      },
    },
  },
  plugins: [],
} satisfies Config;
