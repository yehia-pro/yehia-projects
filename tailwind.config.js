/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./*.html",
    "./js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#e6e8ea",
        "on-error-container": "#93000a",
        "surface-tint": "#494bd6",
        "tertiary-fixed": "#ffdcc5",
        "tertiary-container": "#b55d00",
        "on-secondary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed-dim": "#ffb690",
        "secondary": "#9d4300",
        "on-tertiary": "#ffffff",
        "on-surface-variant": "#464554",
        "on-surface": "#191c1e",
        "outline-variant": "#c7c4d7",
        "inverse-on-surface": "#eff1f3",
        "primary-fixed-dim": "#c0c1ff",
        "on-tertiary-fixed": "#301400",
        "error-container": "#ffdad6",
        "surface-container": "#eceef0",
        "on-primary": "#ffffff",
        "on-tertiary-fixed-variant": "#703700",
        "on-secondary-fixed-variant": "#783200",
        "on-primary-fixed": "#07006c",
        "outline": "#767586",
        "primary": "#4648d4",
        "tertiary": "#904900",
        "secondary-fixed": "#ffdbca",
        "surface-variant": "#e0e3e5",
        "surface-bright": "#f7f9fb",
        "on-tertiary-container": "#fffbff",
        "tertiary-fixed-dim": "#ffb783",
        "on-error": "#ffffff",
        "inverse-primary": "#c0c1ff",
        "error": "#ba1a1a",
        "on-secondary-container": "#5c2400",
        "background": "#f7f9fb",
        "surface-container-low": "#f2f4f6",
        "surface-dim": "#d8dadc",
        "surface": "#f7f9fb",
        "on-background": "#191c1e",
        "surface-container-highest": "#e0e3e5",
        "primary-container": "#6063ee",
        "on-secondary-fixed": "#341100",
        "on-primary-container": "#fffbff",
        "primary-fixed": "#e1e0ff",
        "secondary-container": "#fd761a",
        "on-primary-fixed-variant": "#2f2ebe",
        "inverse-surface": "#2d3133"
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "gutter": "24px",
        "margin-mobile": "16px",
        "xl": "48px",
        "xs": "8px",
        "container-max": "1280px",
        "md": "24px",
        "sm": "16px",
        "lg": "32px",
        "base": "4px"
      },
      fontFamily: {
        "sans": ["IBM Plex Sans", "sans-serif"],
        "headline-lg": ["IBM Plex Sans"],
        "display-lg": ["IBM Plex Sans"],
        "label-sm": ["IBM Plex Sans"],
        "label-md": ["IBM Plex Sans"],
        "headline-lg-mobile": ["IBM Plex Sans"],
        "body-md": ["IBM Plex Sans"],
        "body-lg": ["IBM Plex Sans"],
        "headline-md": ["IBM Plex Sans"]
      },
      fontSize: {
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "500" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }]
      }
    }
  },
  plugins: []
};
