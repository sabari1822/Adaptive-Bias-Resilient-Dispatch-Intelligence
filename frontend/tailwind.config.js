module.exports = {
    content: [
        "./src/pages*.{js,ts,jsx,tsx,mdx}",
        "./src/components*.{js,ts,jsx,tsx,mdx}",
        "./src/app*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "zomato-red": "#E23744",
                "zomato-dark": "#c0303c",
            },
            fontFamily: {
                sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
            },
        },
    },
    plugins: [],
};
