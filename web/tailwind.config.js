/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,ts}',
    ],
    theme: {
        extend: {
            fontFamily: {
                myanmar: ['"Noto Sans Myanmar"', '"Pyidaungsu"', 'sans-serif'],
            },
            animation: {
                'shake': 'shake 0.4s ease-in-out',
                'pop': 'pop 0.2s ease-out',
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%, 60%': { transform: 'translateX(-6px)' },
                    '40%, 80%': { transform: 'translateX(6px)' },
                },
                pop: {
                    '0%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
