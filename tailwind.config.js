/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "media", // setting for dark prefer color scheme
    theme: {
        extend: {
            fontFamily: {
                satoshi: ["Satoshi", "sans-serif"],
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                background: "var(--BACKGROUND)", // --BACKGROUND and --FOREGROUND are the variables
                foreground: "var(--FOREGROUND)", // declared in global.css file under :root{}
                "primary-orange": "#ff5722",
            },
        },
    },
    plugins: [],
};