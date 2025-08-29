import Cookies from 'js-cookie';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get('authToken');

  if (!token) {
    throw new Error('No auth token available');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Check for token refresh from middleware
    const newToken = response.headers.get('X-New-Token');
    if (newToken) {
      Cookies.set('authToken', newToken, {
        expires: 2 / 24, // 2 hours - match the middleware's maxAge
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // Log failed requests in development
    if (!response.ok && process.env.NODE_ENV === 'development') {
      console.error('API request failed:', {
        url,
        status: response.status,
        statusText: response.statusText,
      });
    }

    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw new Error('Failed to connect to the server. Please check your connection.');
  }
}; 