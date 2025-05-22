# Project Directory Structure

This document outlines the directory structure of the Palette web application.

```
/palette
├── .cursor/
│   └── rules/            # AI assistant rules and guidelines
├── .git/                 # Git repository data
├── .vscode/              # VS Code specific settings (optional)
├── docs/
│   ├── directory-structure.md  # This file
│   ├── tech-stack.md         # Project technology stack
│   └── ...                 # Other documentation files (e.g., API docs, task.mdc)
├── node_modules/         # Project dependencies (managed by npm/yarn) - Root level
├── client/               # Frontend React Application
│   ├── node_modules/     # Frontend specific dependencies (if not hoisted to root)
│   ├── public/
│   │   ├── index.html    # Main HTML file for client
│   │   ├── favicon.ico
│   │   └── ...           # Other static assets (images, fonts not in src/assets)
│   ├── src/
│   │   ├── App.tsx         # Main application component, router setup
│   │   ├── index.tsx       # Entry point of the React application
│   │   ├── assets/         # Static assets like images, fonts used by components
│   │   │   └── ...
│   │   ├── components/     # Shared/reusable UI components
│   │   │   ├── common/       # General purpose common components (Button, Input, Modal etc.)
│   │   │   ├── layout/       # Layout components (Header, Footer, MainLayout.tsx etc.)
│   │   │   └── auth/         # Components related to authentication (e.g. EmailVerification.tsx)
│   │   ├── constants/      # Application-wide constants
│   │   ├── contexts/       # React context API providers (e.g., AuthContext.tsx)
│   │   ├── domains/        # Domain-specific modules/features
│   │   │   ├── post/         # Feature module for Posts
│   │   │   │   ├── components/ # UI Components specific to Posts (e.g., PostCard, PostForm)
│   │   │   │   ├── pages/    # Page components for Posts
│   │   │   │   │   └── CreatePostPage.tsx # Page for creating a new post
│   │   │   │   ├── services/ # Services for Posts
│   │   │   │   │   └── post.service.ts    # API calls related to posts
│   │   │   │   └── types/    # TypeScript types specific to Posts
│   │   │   │       └── post.types.ts      # e.g., ICreatePostFormValues
│   │   │   └── user/         # Feature module for Users
│   │   │       ├── mypage/     # Components and logic for the MyPage feature
│   │   │       │   ├── MyPage.tsx          # Main component for MyPage
│   │   │       │   └── MyPage.styles.ts    # Styles for MyPage
│   │   │       ├── services/   # Services for Users
│   │   │       │   └── user.service.ts     # API calls for user data, MyPage data
│   │   │       └── types/      # TypeScript types specific to Users
│   │   │           └── user.types.ts       # e.g., IUserProfile, IMyPageData, User
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # General page-level components (if not fitting into domains)
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProfilePage.tsx # Generic user profile page
│   │   │   └── SettingsPage.tsx
│   │   │   └── ...
│   │   ├── services/       # Shared API service integrations (if not domain-specific)
│   │   ├── store/          # State management setup (e.g., Zustand stores)
│   │   ├── theme/          # MUI theme configuration (e.g., theme.ts, useAppTheme.ts)
│   │   ├── types/          # Global or shared TypeScript type definitions (e.g., auth.types.ts)
│   │   ├── utils/          # Utility functions (e.g., tokenUtils.ts)
│   │   └── setupTests.ts   # Jest setup (or other testing framework setup)
│   ├── .env                # Environment variables for client
│   ├── .eslintignore
│   ├── .eslintrc.js      # ESLint configuration
│   ├── .prettierrc.json  # Prettier configuration
│   ├── package.json
│   ├── package-lock.json # (or yarn.lock)
│   └── tsconfig.json     # TypeScript configuration for client
├── server/                 # Backend Node.js/Express Application
│   ├── public/             # Static files served by backend (e.g., uploaded images)
│   │   └── uploads/
│   │       └── posts/
│   ├── src/                # Source code for the backend
│   │   ├── config/         # Configuration files (db, cloudinary, etc.)
│   │   ├── controllers/    # Request handlers, business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── post.controller.js  # Handles Post related CRUD and logic
│   │   │   ├── comment.controller.js # Handles Comment related CRUD and logic
│   │   │   └── user.controller.js
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   │   ├── upload.middleware.js
│   │   │   ├── avatarUpload.middleware.js # (If distinct from upload.middleware.js)
│   │   │   └── validators/
│   │   │       ├── post.validator.js
│   │   │       └── ...
│   │   ├── models/         # Database models/schemas (Mongoose)
│   │   │   ├── User.js             # User schema (Corrected name)
│   │   │   ├── Post.model.js       # Post schema
│   │   │   └── Comment.model.js    # Comment schema
│   │   ├── routes/         # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── post.routes.js      # Routes for Post APIs
│   │   │   ├── comment.routes.js   # Routes for Comment APIs (typically nested under posts)
│   │   │   └── user.routes.js
│   │   ├── utils/          # Utility functions for backend
│   │   └── index.js        # Main entry point for the backend server
│   ├── .env                # Environment variables for backend
│   ├── .eslintignore
│   ├── .eslintrc.js
│   ├── .gitignore          # Specific to server if needed
│   ├── package.json
│   └── package-lock.json
├── .gitignore              # Root .gitignore
├── README.md
└── ...                   # Other root level config files (babel, jest etc.)
```

## Notes:

*   This structure aims to clearly separate client and server concerns.
*   The `client/src/domains/` directory is for feature-based modules, promoting modularity.
*   Shared components are in `client/src/components/`.
*   This document must be updated whenever significant changes are made to the directory structure.
