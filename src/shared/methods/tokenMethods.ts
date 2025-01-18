import {navigate} from "vike/client/router";

export const TOKEN_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds
export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const refreshToken = async () => {
  try {
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    const { accessToken } = await response.json();
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('accessTokenExpiry', `${Date.now() + TOKEN_TTL}`);
    console.log('Access token refreshed successfully');
    if (window.location.pathname === '/') navigate('/reports')
  } catch (error) {
    console.error('Error refreshing token:', error);
    sessionStorage.setItem('accessToken', '');
    sessionStorage.setItem('accessTokenExpiry', '');
    navigate('/')
    // Optionally handle logout or token expiry
  }
};

export const checkAndRefreshAccessToken = async () => {
  const accessToken = sessionStorage.getItem('accessToken');
  const accessTokenExpiry = parseInt(sessionStorage.getItem('accessTokenExpiry') || '0', 10);
  if (!accessToken || Date.now() > accessTokenExpiry) {
    console.log('Access token is missing or expired, refreshing...');
    await refreshToken();
  } else {
    console.log('Access token is still valid');
    if (window.location.pathname === '/') navigate('/reports')
  }
  setInterval(async () => {
    console.log('Checking token validity for periodic refresh...');
    await refreshToken();
  }, REFRESH_INTERVAL);
};
