module.exports = {
  content: ['./**/*.{jsx,tsx,mdx}'],
  daisyui: {
    themes: ["light", "dark"],
  },
  theme: {
    extend: {
      screens: {
        'sm': '512px', //default '640px'
        '2xl': '1980px' //default '1536px'
      },
    }
  },
  safelist: [
    { pattern: /^col-span-[1-9]$/ },
    { pattern: /^col-span-1[0-2]$/ },
    { pattern: /^col-start-[1-9]$/ },
    { pattern: /^col-start-1[0-2]$/ },
    // {
    //   pattern: /^col-span-[2-4]$/,
    //   variants: ['md'],
    // },
  ],
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio'),
    require("daisyui"),
    ({ addUtilities }) => {
      addUtilities({
        '.grid-responsive': {
          '@apply grid grid-cols-12': {},
        },
        '.cols-responsive': { //xl max 6
          '@apply col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 2xl:col-span-1': {},
        },
        '.cols-responsive-4': { //xl max 4
          '@apply col-span-12 lg:col-span-6 xl:col-span-3 2xl:col-span-2': {},
        },
      });
    },
  ],
};