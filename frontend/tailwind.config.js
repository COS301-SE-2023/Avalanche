/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height'
      },
      keyframes: {
        wiggle: {
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        customPulse: 'wiggle 2s ease-in-out infinite',
      },
      colors: {
        success: {
          border: '#00B257',
          background: '#0cce6b',
        },
        danger: {
          border: '#D30D11',
          background: '#ED4245'
        },
        warning: {
          border: '#F3B900',
          background: '#FFC91B'
        },
        dark: {
          background: '#000C1D',
          secondaryBackground: '#00193B',
          thirdBackground: '#001E45',
          forthBackground: '#002657'
        },
        primaryBackground: '#121212',
        secondaryBackground: '#212121',
        thirdBackground: '#333533',
        avalancheBlue: '#007aff',
        lightHover: '#d1d5db',
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a" },
        indicator: { "1": "#008000", "2": "#00BF40", "3": "#00FF00", "4": "#40FF00", "5": "#80FF00", "6": "#BFFF00", "7": "#FFFF00", "8": "#FFBF00", "9": "#FF8000", "10": "#FF4000", "11": "#FF0000" }
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
    // require("@headlessui/react")
  ],
}
