# Task: Implement Google Social Login

## 1. Objective
Implement Google social login functionality to allow users to sign up and log in using their Google accounts, with distinct flows for login and signup intents.

## 2. Scope

### Frontend
- Add a "Login with Google" button/option to the login and registration interfaces.
- Integrate with Google's OAuth 2.0 flow to obtain an ID token (Implemented using `@react-oauth/google` in `SocialLogin.tsx`).
- Send the Google ID token securely to the backend API, **along with an `intent` parameter ('login' or 'signup')**.
- Handle successful login/signup and update the authentication state (e.g., using `AuthContext`).
- Handle potential errors during the Google login process, **including 'ACCOUNT_NOT_FOUND' for login intent and 'EMAIL_ALREADY_EXISTS' for signup intent, displaying appropriate messages to the user.**

### Backend
- The API endpoint (`POST /api/auth/google`) now accepts an `intent` parameter ('login' or 'signup') in the request body.
- Verify the received Google ID token using Google's authentication library (Implemented).
- Extract user information (email, name, Google ID, profile picture URL) from the verified token (Implemented).
- **If `intent === 'login'`:**
    - If Google ID exists: Log in. `isNewUserResponse = false`.
    - Else if email exists with provider 'email': Return `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK` error.
    - Else if email exists with another social provider (e.g., 'kakao'): Link account (update provider to 'google', set `socialId`), log in. `isNewUserResponse = false`.
    - Else (neither social ID nor email exists): **Return `ACCOUNT_NOT_FOUND` error (e.g., 404). Do NOT create user.**
- **If `intent === 'signup'`:**
    - If Google ID exists: Log in (already signed up). `isNewUserResponse = false`.
    - Else if email (from Google) already exists with any provider: **Return `EMAIL_ALREADY_EXISTS` error (e.g., 409).**
    - Else (social ID is new AND email is new): Create new user record, set `isEmailVerified` based on Google payload, log them in. `isNewUserResponse = true` (for onboarding).
- Ensure appropriate error handling (Implemented).

## 3. User Flow

### Login Intent (`intent: 'login'`):
1. User navigates to the Login page.
2. User clicks "Login with Google".
3. User authenticates with Google.
4. Frontend sends Google ID token and `intent: 'login'` to backend.
5. Backend verifies token.
6. Backend checks for user:
    - If Google ID exists: User is found. Backend returns JWT, `isNewUserResponse: false`.
    - Else if email exists (provider: 'email'): Backend returns `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK` error.
    - Else if email exists (other social provider, e.g., 'kakao'): Account is linked to Google. Backend returns JWT, `isNewUserResponse: false`.
    - Else: **Backend returns `ACCOUNT_NOT_FOUND` error.**
7. Frontend handles response:
    - On JWT: Updates `AuthContext`, redirects to main page (`/`).
    - On `ACCOUNT_NOT_FOUND`: **Displays message (e.g., "Account not found. Please sign up.").**
    - On `EMAIL_ACCOUNT_EXISTS_NEEDS_MANUAL_LINK`: Displays message (e.g., "An account with this email already exists. Please log in with your email and password to connect your Google account from settings, or use a different Google account.").

### Signup Intent (`intent: 'signup'`):
1. User navigates to the Registration page.
2. User clicks "Sign up with Google".
3. User authenticates with Google.
4. Frontend sends Google ID token and `intent: 'signup'` to backend.
5. Backend verifies token.
6. Backend checks for user:
    - If Google ID exists: User is found (already registered). Backend returns JWT, `isNewUserResponse: false`.
    - Else if email (from Google) exists: **Backend returns `EMAIL_ALREADY_EXISTS` error.**
    - Else: New user is created. Backend returns JWT, `isNewUserResponse: true`.
7. Frontend handles response:
    - On JWT (`isNewUserResponse: true`): Updates `AuthContext`, redirects to social onboarding page (`/social-onboarding`).
    - On JWT (`isNewUserResponse: false`): Updates `AuthContext`, redirects to main page (`/`) (already registered).
    - On `EMAIL_ALREADY_EXISTS`: **Displays message (e.g., "Email already registered. Please log in.").**

## 4. Affected Files/Modules (Updated)

### Frontend (`client/src/`)
- `components/auth/Login.tsx` (or Login Page): **Needs to use `<SocialLogin flowIntent="login" />`.**
- `components/auth/Register.tsx` (or Register Page): **Needs to use `<SocialLogin flowIntent="signup" />`.**
- `components/auth/SocialLogin.tsx`: Updated to accept `flowIntent` prop, pass it to `AuthContext.socialLogin`, and handle new error responses to display user messages.
- `contexts/AuthContext.tsx`: `socialLogin` function updated to accept `intent`, pass it to backend, and return a structured response including potential `errorCode`.
- `utils/api.ts`: (No changes, used by `AuthContext`).
- `.env`: Stores `REACT_APP_GOOGLE_CLIENT_ID` (Setup complete).

### Backend (`server/src/`)
- `routes/auth.js`: (No changes, existing `/google` route used).
- `controllers/auth.js` (`googleLogin` function): **Updated to handle `intent` parameter and implement differentiated logic for login vs. signup, returning specific error codes.**
- `middleware/auth.js` (`sendTokenResponse` function): Updated to always include `isNewUser` boolean in response.
- `models/User.js`: (No schema changes needed, existing fields utilized).
- `.env`: Stores `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Setup complete).

## 5. Security Considerations
- Use HTTPS for all communications.
- Securely handle and transmit the Google ID token from frontend to backend.
- Verify the Google ID token on the backend using Google's official libraries to ensure its authenticity and integrity (check `aud` - audience, `iss` - issuer, and expiry).
- Protect against CSRF if any part of the flow involves redirects that could be susceptible (ID token flow is generally less susceptible than auth code flow with redirects for token exchange).
- Store `googleId` securely and ensure it's indexed for efficient lookups.

## 6. Dependencies & Setup

### Frontend
- **Google Cloud Console:**
    - Create OAuth 2.0 Credentials (Client ID).
    - Configure Authorized JavaScript Origins.
- **Library:** `@react-oauth/google` (or similar React library for Google Sign-In).
    - Installation: `npm install @react-oauth/google` or `yarn add @react-oauth/google`.

### Backend
- **Google Cloud Console:** (May reuse Client ID, or have a separate one for web server applications if needed by Google's setup, Client Secret will be used here).
- **Library:** `google-auth-library` (for Node.js).
    - Installation: `npm install google-auth-library` or `yarn add google-auth-library`.

## 7. Acceptance Criteria (Updated)
- Users clicking "Login with Google" on the login page:
    - If account exists (Google ID match): Logs in, redirected to main page.
    - If account exists (email match, provider 'email'): Shows "Account with this email already exists... needs manual link" message, does NOT log in or link automatically.
    - If account exists (email match, other social provider e.g., 'kakao'): Links account to Google, logs in, redirected to main page.
    - If account does not exist (neither social ID nor email matches): **Shows "Account not found" message, does NOT create account.**
- Users clicking "Sign up with Google" on the registration page:
    - If Google ID is new and email is new: Creates account, redirects to `/social-onboarding`.
    - If Google ID exists: Logs in (treats as already registered), redirected to main page.
    - If email (from Google) exists with another provider: **Shows "Email already exists" message, does NOT create new account or automatically link during signup intent.**
- Process is secure, tokens handled correctly.

## 8. Next Steps (Updated)
1.  **Implement Kakao Login:** Update `kakaoLogin` controller on backend to support `intent` parameter, similar to `googleLogin`.
2.  **Integrate `<SocialLogin />` into Login/Register Pages:** Ensure `SocialLogin` component is used in the respective pages with the correct `flowIntent` prop (`login` or `signup`).
3.  **UI for Error Messages:** Enhance UI in `SocialLogin.tsx` or calling pages to more gracefully display messages for `ACCOUNT_NOT_FOUND` and `EMAIL_ALREADY_EXISTS` (e.g., with links to the appropriate page - login or signup).
4.  **Thorough Testing:** Test all login and signup flows for Google (and then Kakao) including new user, existing user, account linking (on login intent), account not found, and email exists scenarios.
5.  Review and refine COOP header policies if pop-up behavior is problematic.
6.  Request user approval for merge once all social login updates are complete and tested. 