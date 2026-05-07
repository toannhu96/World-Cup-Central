import colors from "../constants/colors";

export function useColors() {
  // Simple fallback to light theme for now, or detect system preference
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const palette = isDark ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
