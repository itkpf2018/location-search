import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Premium Blue-White Color Palette
            colors: {
                primary: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                },
            },
            // Thai-optimized Font Family
            fontFamily: {
                sans: [
                    'Sarabun',
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'Noto Sans',
                    'sans-serif',
                ],
            },
            // Enhanced Responsive Breakpoints
            screens: {
                'xs': '375px',   // Small phones
                'sm': '640px',   // Large phones
                'md': '768px',   // Tablets
                'lg': '1024px',  // Small laptops
                'xl': '1280px',  // Desktops
                '2xl': '1536px', // Large desktops
                '3xl': '1920px', // Ultra-wide
            },
            // Animations
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                'bounce-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.4s ease-out',
                'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
                'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
            },
            // Spacing for better mobile UX
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            // Border Radius
            borderRadius: {
                '4xl': '2rem',
            },
            // Box Shadow
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
            },
            // Backdrop Blur
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}

export default config
