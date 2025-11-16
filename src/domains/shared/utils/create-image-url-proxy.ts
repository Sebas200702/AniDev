/**
 * Creates a proxy URL for serving optimized images through the API.
 *
 * @description This utility function generates a URL for proxying and optimizing images.
 * It constructs an API endpoint URL that can process and serve images with optional
 * transformations. When width, quality, and format parameters are provided, the function
 * creates a URL with these optimization parameters. Otherwise, it returns a basic proxy
 * URL without transformation parameters.
 *
 * The function helps improve page loading performance by allowing on-demand image optimization
 * including resizing, quality adjustment, and format conversion. This is particularly useful
 * for responsive designs where different image sizes are needed for different devices or
 * for progressive image loading techniques.
 *
 * @param {string} imageUrl - The original image URL to be proxied
 * @param {string} [width] - Optional width parameter for resizing the image
 * @param {string} [quality] - Optional quality parameter for compression level
 * @param {string} [format] - Optional format parameter for image conversion
 * @returns {string} The constructed proxy URL with or without transformation parameters
 *
 * @example
 * createImageUrlProxy('https://example.com/image.jpg', '800', '75', 'webp')
 * // Returns: "/api/proxy?url=https://example.com/image.jpg&w=800&q=75&format=webp"
 */
export const createImageUrlProxy = (
  imageUrl: string,
  width?: string,
  quality?: string,
  format?: string
) => {
  if (!imageUrl) return ''
  return !width || !quality || !format
    ? `/api/proxy?url=${imageUrl}`
    : `/api/proxy?url=${imageUrl}&w=${width}&q=${quality}&format=${format}`
}
