/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        screens: {
            'min-xl': { 'min': '1079px' },
            'min-lg': { 'min': '823px' },
            'min-md': { 'min': '567px' },
            'min-sm': { 'min': '439px' },
            //
            // 'xl': {
            //     'max': '1279px',
            //     'min': '1079px',
            // },
            // // => @media (max-width: 1279px) { ... }
            //
            // 'lg': {
            //     'max': '1023px',
            //     'min': '823px',
            // },
            // // => @media (max-width: 1023px) { ... }
            //
            // 'md': {
            //     'max': '767px',
            //     'min': '567px',
            // },
            // // => @media (max-width: 767px) { ... }
            //
            // 'sm': {
            //     'max': '639px',
            //     'min': '439px',
            // },
            // => @media (max-width: 639px) { ... }

            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        }
    },
    plugins: [],
};

module.exports = config;
