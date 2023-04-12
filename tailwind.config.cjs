/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        screens: {
            'over-xl': { 'min': '1079px' },
            'over-lg': { 'min': '823px' },
            'over-md': { 'min': '567px' },
            'over-sm': { 'min': '440px' },

            'bellow-xl': { 'max': '1079px' },
            'bellow-lg': { 'max': '823px' },
            'bellow-md': { 'max': '567px' },
            'bellow-sm': { 'max': '439px' },

            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        }
    },
    plugins: [],
};

module.exports = config;
