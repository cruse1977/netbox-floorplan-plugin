/**
 * CSRF Token Utility
 * Extracts CSRF token from Django-rendered page
 */

export function getCSRFToken(): string | null {
  // First try: Get from hidden input (Django template renders this)
  const csrfInput = document.querySelector<HTMLInputElement>('#csrf');
  if (csrfInput && csrfInput.value) {
    return csrfInput.value;
  }

  // Second try: Get from data attribute
  const dataElement = document.querySelector('[data-csrf-token]');
  if (dataElement) {
    const token = dataElement.getAttribute('data-csrf-token');
    if (token) return token;
  }

  // Third try: Get from cookie (Django default)
  const cookieMatch = document.cookie.match(/csrftoken=([^;]+)/);
  if (cookieMatch) {
    return cookieMatch[1];
  }

  console.warn('CSRF token not found');
  return null;
}

/**
 * Set CSRF token globally for use by API client
 */
export function setGlobalCSRFToken(token: string): void {
  (window as any).__CSRF_TOKEN__ = token;
}

/**
 * Get globally stored CSRF token
 */
export function getGlobalCSRFToken(): string | null {
  return (window as any).__CSRF_TOKEN__ || null;
}
