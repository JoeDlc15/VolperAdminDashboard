/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#059669", // emerald-600
                    light: "#10b981",   // emerald-500
                    dark: "#34d399",    // emerald-400
                    hover: "#047857",   // emerald-700
                },
                surface: {
                    light: "#ffffff",
                    dark: "#0f172a",    // slate-900
                }
            },
            fontFamily: {
                display: ['Outfit', 'Inter', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
