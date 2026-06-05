/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Resolves an image path to the production server URL (https://gokcf.org) 
 * so that we always use the user's real images instead of generic stock images.
 */
export function resolveImageUrl(path: string): string {
  if (!path) return "";
  
  // Clean up any double slashes or leading slash prefix
  let cleanPath = path;
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  // Prepend the production server domain for all church image/branding assets
  if (cleanPath.toLowerCase().startsWith("img/")) {
    return `https://gokcf.org/${cleanPath}`;
  }

  return path;
}
