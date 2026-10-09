/**
 * Share utilities — encode/decode session results into URL-safe base64.
 */

/**
 * Encode results data into a URL-safe base64 string.
 * @param {Object} data
 * @returns {string}
 */
export function encodeShareData(data) {
  try {
    const json = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    // Make URL-safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

/**
 * Decode a URL-safe base64 string back to results data.
 * @param {string} encoded
 * @returns {Object|null}
 */
export function decodeShareData(encoded) {
  try {
    // Reverse URL-safe
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    while (base64.length % 4) base64 += '=';
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL with encoded results in the hash.
 * @param {Object} data
 * @returns {string}
 */
export function generateShareUrl(data) {
  const encoded = encodeShareData(data);
  return `${window.location.origin}${window.location.pathname}#/shared/${encoded}`;
}

/**
 * Copy text to clipboard.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  }
}
