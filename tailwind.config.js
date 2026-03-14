/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1C3D',
          light: '#162d5e',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#e0c97a',
        },
        surface: '#FFFFFF',
        'app-bg': '#F4F6FA',
        'text-secondary': '#4A5568',
        'text-muted': '#A0AEC0',
        error: '#C53030',
        success: '#276749',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Soft shadow for cards and form panels
        card: '0 4px 24px rgba(11, 28, 61, 0.08)',
        // Stronger shadow for elevated elements
        elevated: '0 8px 40px rgba(11, 28, 61, 0.14)',
      },
      borderRadius: {
        // Consistent rounding across all form elements
        input: '0.375rem',
      },
    },
  },
  plugins: [],
}