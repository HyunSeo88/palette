# Palette Web Application Tech Stack

This document outlines the primary technologies, frameworks, libraries, and tools used in the Palette web application project.

## 1. Backend

*   **Runtime Environment**: Node.js
*   **Web Framework**: Express.js
*   **Database**: MongoDB
*   **ODM (Object Data Modeling)**: Mongoose
*   **Authentication**: JWT (JSON Web Tokens), `bcryptjs` (for password hashing)
*   **API Validation**: `express-validator`
*   **CORS**: `cors` (Cross-Origin Resource Sharing)
*   **Google Authentication**: `google-auth-library`
*   **Security Headers**: `helmet`
*   **File Uploads**: `multer`
*   **Email Sending**: `nodemailer`
*   **Development Tools**:
    *   `nodemon` (for automatic server restarts during development)
    *   `jest` (for testing)

## 2. Frontend

*   **Core Library/Framework**: React (using Create React App with TypeScript)
*   **Language**: TypeScript
*   **UI Library**: Material-UI (MUI) (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`)
*   **Routing**: `react-router-dom`
*   **State Management**: `zustand`
*   **API Client**: `axios` (see General Tools)
*   **Form Management & Validation**:
    *   `react-hook-form`
    *   `zod` (for schema validation)
    *   `@hookform/resolvers` (for integrating react-hook-form with Zod)
*   **Date Utility**: `date-fns` (for date formatting and manipulation)
*   **Animation**: `framer-motion`
*   **Image Loading**: `imagesloaded`
*   **Layout**: `masonry-layout`, `react-masonry-css`
*   **Icons**: `react-feather` (alternative/additional icon set)
*   **Styling**: `styled-components` (CSS-in-JS, can be used alongside or independently of MUI)
*   **Social Login SDKs**:
    *   Google Sign-In: `@react-oauth/google`
    *   Kakao JavaScript SDK (integrated via script tag, not npm package)

## 3. General Tools

*   **Version Control**: Git, GitHub
*   **Package Managers**: npm (for both client and server)
*   **API Client**: `axios` (used by both frontend and potentially backend)
*   **Linters/Formatters**: ESLint, Prettier (configuration typically in `package.json` or dedicated config files)

## 4. Deployment (Placeholder - To Be Defined)

*   **Server Hosting**: (e.g., AWS EC2, Heroku, Vercel for Node.js)
*   **Client Hosting**: (e.g., Vercel, Netlify, AWS S3/CloudFront)
*   **Database Hosting**: (e.g., MongoDB Atlas)

## 5. Environment Variables

*   **Client (`client/.env`)**:
    *   `REACT_APP_API_BASE_URL`
    *   `REACT_APP_GOOGLE_CLIENT_ID`
    *   `REACT_APP_KAKAO_JS_KEY`
*   **Server (`server/.env`)**:
    *   `PORT`
    *   `MONGODB_URI`
    *   `JWT_SECRET`
    *   `GOOGLE_CLIENT_ID` (if server-side verification is used for Google with `google-auth-library`)
    *   `SERVER_BASE_URL`
    *   `CLIENT_BASE_URL`
    *   _(Potentially others for `nodemailer` or other services if configured)_

---
*This document should be kept up-to-date with any changes to the technology stack.* 