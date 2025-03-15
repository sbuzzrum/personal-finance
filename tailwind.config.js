export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))'
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' }
                }
            },
            animation: {
                gradient: 'gradient 6s ease infinite'
            }
        }
    },
    plugins: [require('tailwindcss-primeui'), require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/container-queries')]
};
