import type { Config } from "tailwindcss";
const { addDynamicIconSelectors } = require("@iconify/tailwind");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        intro: {
          from: { transform: "h-[100px]" },
          to: { transform: " h-[200px]" },
        },
      },
      animation: {
        intro: "intro 1s ease-in-out",
      },
      transitionProperty: {
        height: "height",
      },
      lineClamp: {
        '2': '2',
        'none': 'unset'
      }
    },
  },
  variants: {
    extend: {
      lineClamp: ['hover']
    }
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    addDynamicIconSelectors(),
    require('@tailwindcss/line-clamp'),

  ],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: [
      {
        'bumblebee': {
           'primary' : '#f9d72f',
           'primary-focus' : '#e9c307',
           'primary-content' : '#18182f',

           'secondary' : '#dfa62a',
           'secondary-focus' : '#be8b1e',
           'secondary-content' : '#ffffff',

           'accent' : '#18182f',
           'accent-focus' : '#111122',
           'accent-content' : '#ffffff',

           'neutral' : '#18182f',
           'neutral-focus' : '#111122',
           'neutral-content' : '#ffffff',

           'base-100' : '#ffffff',
           'base-200' : '#f5f5f5',
           'base-300' : '#e3e3e3',
           'base-content' : '#000000',

           'info' : '#1c92f2',
           'success' : '#009485',
           'warning' : '#ff9900',
           'error' : '#ff5724',

          '--rounded-box': '1rem',          
          '--rounded-btn': '.5rem',        
          '--rounded-badge': '1.9rem',      

          '--animation-btn': '.25s',       
          '--animation-input': '.2s',       

          '--btn-text-case': 'uppercase',   
          '--navbar-padding': '.5rem',      
          '--border-btn': '1px',            
        },
      },
    ],// false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "business", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};

export default config;
