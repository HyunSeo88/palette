export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const KAKAO_APP_KEY = process.env.REACT_APP_KAKAO_APP_KEY || '';

export const OAUTH_REDIRECT_URI = process.env.REACT_APP_OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback';

export const initializeOAuth = () => {
  // Initialize Google OAuth
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.onload = () => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
      });
    });
  };
  document.body.appendChild(script);

  // Initialize Kakao SDK
  const kakaoScript = document.createElement('script');
  kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js';
  kakaoScript.onload = () => {
    window.Kakao.init(KAKAO_APP_KEY);
  };
  document.body.appendChild(kakaoScript);
};

// Type definitions for window object
declare global {
  interface Window {
    gapi: any;
    Kakao: any;
  }
} 