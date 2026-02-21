/**
 * Apply opacity to a color string (hex or rgba).
 * @param color - Hex (#RRGGBB) or rgba string
 * @param opacity - 0 to 1
 */
export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${color}${alpha}`;
};
