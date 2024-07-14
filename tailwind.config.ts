/** @type {import('tailwindcss').Config} */
import {iconsPlugin, getIconCollections} from "@egoist/tailwindcss-icons"

export const content = ["./src/**/*.{html,js,vue,jsx,ts,tsx}"]
export const theme = {
    screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '768px',
        // => @media (min-width: 768px) { ... }

        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }

        // Your custom screens
        'tablet': '1023px',
        'laptop': '1024px',
        'desktop': '1280px',
    },
    extend: {},
}
export const plugins = [
    require('@tailwindcss/typography'),
    iconsPlugin({
        // Select the icon collections you want to use
        // You can also ignore this option to automatically discover all individual icon packages you have installed
        // If you install @iconify/json, you should explicitly specify the collections you want to use, like this:
        collections: getIconCollections(["mdi", "fa", "fa-solid"]),
        // If you want to use all icons from @iconify/json, you can do this:
        // collections: getIconCollections("all"),
        // and the more recommended way is to use `dynamicIconsPlugin`, see below.
    }),
]