# Palette Web Application Tech Stack

This document outlines the primary technologies, frameworks, libraries, and tools used in the Palette web application project.

## 1. Backend

*   **Runtime Environment**: Node.js
*   **Web Framework**: Express.js
*   **Database**: MongoDB
*   **ODM (Object Data Modeling)**: Mongoose
*   **Authentication**: JWT (JSON Web Tokens), bcrypt (for password hashing)
*   **API Validation**: express-validator

## 2. Frontend

*   **Core Library/Framework**: React (using Create React App with TypeScript)
*   **Language**: TypeScript
*   **UI Library**: Material-UI (MUI)
*   **Routing**: React Router DOM
*   **State Management**: Zustand
*   **API Client**: Axios (assumed, standard choice - can be confirmed/updated)
*   **Form Validation**: Zod
*   **Social Login SDKs**:
    *   Google Sign-In for Websites (Google Identity Services)
    *   Kakao JavaScript SDK

## 3. General Tools

*   **Version Control**: Git, GitHub
*   **Package Managers**: npm (for both client and server)
*   **Linters/Formatters**: ESLint, Prettier (assumed, standard for React/TS projects - can be confirmed/updated)

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
    *   `GOOGLE_CLIENT_ID` (if server-side verification is used for Google)
    *   `SERVER_BASE_URL`
    *   `CLIENT_BASE_URL`

---
*This document should be kept up-to-date with any changes to the technology stack.* 