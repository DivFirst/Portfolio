/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./style-test/**/*.{html,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0a0d14',
          panel: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.12)',
          gold: '#f59e0b',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#d97706'
        },
        // Arcade palette (DESIGN.md §2). Use e.g. bg-arcade-bg, text-arcade-pink.
        arcade: {
          bg: '#0b0b1a',
          panel: '#14142b',
          'panel-2': '#1d1d3a',
          text: '#e8e8f5',
          muted: '#a0a0c0',
          dim: '#6b6b8f',
          pink: '#ff2e88',
          'pink-dark': '#a3104f',
          cyan: '#00f0ff',
          'cyan-dark': '#007a85',
          yellow: '#ffe600',
          'yellow-dark': '#9e8c00',
          green: '#39ff14',
          'green-dark': '#1f8f0a',
          purple: '#9d4dff',
          'purple-text': '#b57bff',
        }
      },
      fontFamily: {
        game: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        // Arcade fonts (DESIGN.md §1)
        pixel: ['"Press Start 2P"', '"Courier New"', 'monospace'],
        arcade: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
        score: ['VT323', 'monospace'],
      },
      boxShadow: {
        'pixel-hard': '4px 4px 0 0 #000',
        'pixel-hard-lg': '8px 10px 0 0 #000',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'floatSlow 4s infinite ease-in-out',
        'arcade-blink': 'arcadeBlink 1s steps(1) infinite',
        'arcade-pulse': 'arcadePulse 1.6s steps(4) infinite',
        'arcade-pop': 'arcadePop 160ms steps(4)',
        'arcade-flicker': 'arcadeFlicker 2s steps(10) 1',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        arcadeBlink: {
          '50%': { opacity: 0 },
        },
        arcadePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        arcadePop: {
          // uses `scale`, not `transform`, so it never fights a positioning transform
          from: { opacity: 0, scale: '0.96' },
          to: { opacity: 1, scale: '1' },
        },
        arcadeFlicker: {
          '0%': { opacity: 0.2 },
          '10%': { opacity: 1 },
          '20%': { opacity: 0.6 },
          '30%, 100%': { opacity: 1 },
        },
      }
    },
  },
  plugins: [],
}
