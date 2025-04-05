// theme.js

export const lightColors = {
    background: "#ffffff",      // Main background
    text: "#000000",            // Primary text
    primary: "#6200ee",         // Accent / primary color
    card: "#f5f5f5",            // Card or surface background
    border: "#e0e0e0",          // Border color
  
    // Background theme tint with adjustable intensity
    bgTheme: (intensity) => `rgba(49, 130, 206, ${intensity})`,
  
    // Overlay for modals, cards, etc. in light mode (black tint)
    overlay: (intensity) => `rgba(0, 0, 0, ${intensity})`,
  };
  
  export const darkColors = {
    background: "#121212",      // Main background in dark mode
    text: "#ffffff",            // Text color in dark mode
    primary: "#bb86fc",         // Accent / primary color in dark mode
    card: "#1e1e1e",            // Card/surface in dark mode
    border: "#373737",          // Border in dark mode
  
    // Background theme tint (same as light for visual consistency)
    bgTheme: (intensity) => `rgba(49, 130, 206, ${intensity})`,
  
    // Overlay in dark mode (light tint for contrast)
    overlay: (intensity) => `rgba(255, 255, 255, ${intensity})`,
  };
  