// utils/colors.js
export const colors = {
  // Primary Colors
  primary: "#2A4BA0", // Main brand color
  primaryDark: "#153075", // Darker shade for contrast
  primaryLight: "#E7EFFF", // Light tint for backgrounds
  primary1: "#2575fc",

  // Secondary Colors
  secondary: "#FFC635", // Accent color
  secondaryDark: "#F19A02", // Darker accent

  // Background Colors
  background: "#F8F9FB", // Main background
  surface: "#FFFFFF", // Cards/surface elements

  // Text Colors
  textPrimary: "#1E222B", // Primary text
  textSecondary: "#616A7D", // Secondary text
  textDisabled: "#8891A5", // Disabled text
  textInverted: "#FFFFFF", // Text on dark backgrounds
  accent: "#4CAF50",
  text: "#333",
  grey: "#999",
  white: "#fff",
  // Status Colors
  success: "#4BB543", // Success messages
  warning: "#FFC107", // Warning alerts
  error: "#FF3B30", // Error messages
  info: "#17A2B8", // Informational messages

  // Borders and Lines
  border: "#EBEBFB", // Borders and dividers
  separator: "#E3E8EF", // Subtle separators

  // Additional Colors
  placeholder: "#A9B4BC", // Input placeholder text
  overlay: "rgba(0,0,0,0.5)", // Overlay background
  shadow: "rgba(0,0,0,0.1)", // Shadow color
};

// Optional: Add semantic names for specific components
export const componentColors = {
  buttonPrimary: colors.primary,
  buttonSecondary: colors.secondary,
  headerBackground: colors.primary,
  tabBarActive: colors.primary,
  tabBarInactive: colors.textDisabled,
};
