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
│   └── ...                 # Other documentation files (e.g., API docs)
├── node_modules/         # Project dependencies (managed by npm/yarn)
├── public/
│   ├── index.html        # Main HTML file
│   ├── favicon.ico
│   └── ...                 # Other static assets
├── src/
│   ├── App.js              # Main application component, router setup
│   ├── App.css             # Main application styles (or other styling solution)
│   ├── index.js            # Entry point of the React application
│   ├── index.css           # Global styles (or other styling solution)
│   ├── assets/             # Static assets like images, fonts
│   │   └── images/
│   │   └── fonts/
│   ├── components/         # Shared/reusable UI components
│   │   ├── common/           # General purpose common components (Button, Input, Modal etc.)
│   │   ├── layout/           # Layout components (Header, Footer, Sidebar etc.)
│   │   └── profile/          # Components specific to the profile feature (NEW)
│   │       ├── UserProfileInfo.js # Placeholder for user info display (NEW)
│   │       └── UserActivityTabs.js # Placeholder for activity tabs (NEW)
│   ├── constants/          # Application-wide constants
│   ├── contexts/           # React context API providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page-level components (mapped to routes)
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   ├── ProfilePage.js    # User profile page (NEW)
│   │   └── ...               # Other pages
│   ├── services/           # API service integrations (e.g., Axios instances, API call functions)
│   ├── store/              # State management setup (e.g., Zustand stores)
│   ├── styles/             # Global styles, themes, mixins (if not using CSS-in-JS primarily)
│   ├── types/              # TypeScript type definitions (if using TypeScript)
│   ├── utils/              # Utility functions
│   └── setupTests.js       # Jest setup (or other testing framework setup)
├── .env                    # Environment variables (client-side, if Create React App based)
├── .eslintignore
├── .eslintrc.js          # ESLint configuration (or .json, .yaml)
├── .gitignore
├── .prettierrc.json      # Prettier configuration (or .js, .yaml)
├── package.json
├── package-lock.json     # (or yarn.lock)
├── README.md
└── task-profile-page-frontend-setup.mdc # Task documentation for this feature (NEW)
```

## Notes:

*   This structure is a general guideline and can be adapted based on project needs.
*   Feature-specific components should ideally reside within `src/components/{featureName}/` or directly within the `src/pages/{PageName}.js` if very specific and not reused.
*   Shared components go into `src/components/common/` or `src/components/layout/`.
*   This document must be updated whenever significant changes are made to the directory structure. 