/**
 * Converts a color string in any format to its RGB components.
 *
 * @description
 * This utility function takes a color string in various formats and converts it to a standardized RGB format.
 * It supports the following input formats:
 * - Hexadecimal (#RGB or #RRGGBB)
 * - RGB (rgb(r,g,b))
 * - RGBA (rgba(r,g,b,a))
 *
 * The function handles:
 * - Case-insensitive input
 * - Whitespace trimming
 * - Short hex codes (#RGB) expansion
 * - Input validation and fallback
 *
 * @example
 * ```typescript
 * // Hex color examples
 * colorToRGB('#ff0000')     // Returns "255,0,0"
 * colorToRGB('#f00')        // Returns "255,0,0"
 *
 * // RGB/RGBA examples
 * colorToRGB('rgb(255,0,0)')      // Returns "255,0,0"
 * colorToRGB('rgba(255,0,0,0.5)') // Returns "255,0,0"
 *
 * // Invalid input handling
 * colorToRGB('invalid')     // Returns "255,255,255"
 * ```
 *
 * @param {string} color - The input color string in hex, RGB, or RGBA format
 * @returns {string} A comma-separated string of RGB values (e.g. "255,255,255")
 * @throws {never} This function never throws - it returns a default white color for invalid inputs
 */
export const colorToRGB = (color: string): string => {
  color = color.toLowerCase().trim()

  if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g)
    if (values && values.length >= 3) {
      return `${values[0]},${values[1]},${values[2]}`
    }
  }

  if (color.startsWith('#')) {
    if (color.length === 4) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
    }

    const r = Number.parseInt(color.slice(1, 3), 16)
    const g = Number.parseInt(color.slice(3, 5), 16)
    const b = Number.parseInt(color.slice(5, 7), 16)

    return `${r},${g},${b}`
  }

  return '255,255,255'
}
