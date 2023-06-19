/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        customPulse: 'wiggle 2s ease-in-out infinite',
      },
      colors: {
        primaryBackground: '#121212',
        secondaryBackground: '#212121',
        thirdBackground: '#333533',
        avalancheBlue: '#007aff',
        lightHover: '#d1d5db',
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a" }
      }
    },
    fontFamily: {
      'body': [
        'Karla',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Karla',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ]
    }
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
