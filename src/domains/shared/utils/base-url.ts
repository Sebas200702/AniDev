/**
 * Application URL and title configuration constants.
 *
 * @description This module provides essential configuration constants for the application.
 * It defines the base URL for API requests that changes based on the current environment,
 * using the production URL when in production mode and localhost for development.
 * The module also defines the default title for the application that's used across
 * various components for consistent branding.
 *
 * The baseUrl constant is environment-aware and automatically selects the appropriate
 * URL based on the Node environment variable. This ensures that API requests are directed
 * to the correct endpoint without requiring manual configuration changes between
 * development and production deployments.
 *
 * The baseTitle constant provides the default application title used for SEO purposes,
 * browser tabs, and other areas where the application name needs to be displayed.
 *
 * @constant {string} baseUrl - The base URL for API requests, changes based on environment
 * @constant {string} baseTitle - The default title for the application
 *
 * @example
 * import { baseUrl } from '@utils/base-url';
 * const apiEndpoint = `${baseUrl}/api/animes/full`;
 */
const getProductionUrl = () => {
  if (globalThis.window === undefined) {
    return 'https://anidev.app'
  }
  return globalThis.window.location.origin
}

export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? getProductionUrl()
    : 'http://localhost:4321'

export const baseTitle = 'AniDev - Watch anime online free'
