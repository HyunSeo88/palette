import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
console.log('Attempting to use Google Client ID from index.tsx:', googleClientId); // Debug log

if (!googleClientId) {
  console.error("Google Client ID not found. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file.");
  // Optionally, render an error message or a fallback UI
}

root.render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    ) : (
      <div>Google Client ID is missing. Social login will not work.</div> // Fallback UI
    )}
  </React.StrictMode>
); 