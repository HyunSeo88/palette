# Project Directory Structure

This document outlines the directory structure of the Palette web application.

```
/palette
├── .cursor/
│   └── rules/            # AI assistant rules and guidelines
├── .git/                 # Git repository data
├── .vscode/              # VS Code specific settings (optional)
├── client/               # Frontend React Application
│   ├── node_modules/     # Frontend specific dependencies (if not hoisted to root)
│   ├── public/
│   │   ├── index.html    # Main HTML file for client
│   │   ├── favicon.ico
│   │   ├── manifest.json # Web application manifest file
│   │   └── images/       # Static images in public folder
│   ├── src/
│   │   ├── App.tsx         # Main application component, router setup
│   │   ├── index.tsx       # Entry point of the React application
│   │   ├── assets/         # Static assets like images, fonts used by components
│   │   │   └── icons/      # Icons used in the application
│   │   ├── components/     # Shared/reusable UI components
│   │   │   ├── common/       # General purpose common components (Button, Input, Modal etc.)
│   │   │   ├── layout/       # Layout components (Header, Footer, MainLayout.tsx etc.)
│   │   │   │   └── SlideInMenu.tsx # New slide-in menu component
│   │   │   └── auth/         # Components related to authentication (e.g. EmailVerification.tsx)
│   │   │       └── LoginModalDialog.tsx # New login modal dialog component
│   │   ├── constants/      # Application-wide constants
│   │   │   └── animations.ts      # Animation constants and configurations
│   │   ├── contexts/       # React context API providers (e.g., AuthContext.tsx)
│   │   ├── domains/        # Domain-specific modules/features
│   │   │   ├── ootd/         # Feature module for OOTD (Outfit of the Day)
│   │   │   │   ├── components/ # UI Components specific to OOTD
│   │   │   │   │   ├── TopOotdCarousel.tsx  # Carousel for top OOTD posts
│   │   │   │   │   ├── OotdPostList.tsx     # Grid/list view of OOTD posts
│   │   │   │   │   ├── OotdPostCard.tsx     # Individual OOTD post card
│   │   │   │   │   ├── KeywordFilter.tsx    # Filter component for OOTD
│   │   │   │   │   ├── OotdCommentModal.tsx # Modal for OOTD comments
│   │   │   │   │   ├── OotdInfoModal.tsx    # Modal for OOTD details
│   │   │   │   │   └── enhanced/            # Enhanced components for Phase 1-3
│   │   │   │   │       ├── MasonryOotdGrid.tsx       # Masonry layout grid
│   │   │   │   │       ├── EnhancedOotdCard.tsx      # Enhanced card with hover effects
│   │   │   │   │       ├── ColorPalette.tsx          # Color palette component
│   │   │   │   │       ├── FloatingActionButton.tsx  # FAB for new OOTD
│   │   │   │   │       ├── StickyFilterBar.tsx       # Sticky filter component
│   │   │   │   │       ├── InteractiveHeart.tsx      # Double-tap heart animation
│   │   │   │   │       ├── CarouselNavigation.tsx    # Carousel navigation buttons
│   │   │   │   │       └── CarouselIndicators.tsx    # Carousel indicators
│   │   │   │   ├── hooks/      # Custom hooks for OOTD
│   │   │   │   │   └── useCarouselSlide.ts  # Carousel slide management hook
│   │   │   │   ├── pages/      # Page components for OOTD
│   │   │   │   │   └── OotdPage.tsx         # Main OOTD page
│   │   │   │   ├── services/   # Services for OOTD
│   │   │   │   │   └── ootd.service.ts      # API calls related to OOTD
│   │   │   │   ├── stores/     # Zustand stores for OOTD
│   │   │   │   │   └── useOotdStore.ts      # OOTD state management
│   │   │   │   └── types/      # TypeScript types specific to OOTD
│   │   │   │       └── ootd.types.ts        # OOTD related types
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
│   │   │       │   ├── MyPage.tsx          # Main component for MyPage (user-specific content)
│   │   │       │   └── components/         # MyPage specific components
│   │   │       │       ├── UserProfileCard.tsx    # User profile display card
│   │   │       │       ├── ActivitySummary.tsx    # User activity statistics
│   │   │       │       ├── PostTypeFilter.tsx     # Post filtering tabs
│   │   │       │       ├── PostGrid.tsx           # Posts grid with pagination
│   │   │       │       └── UserPostCard.tsx       # Individual post card
│   │   │       ├── services/   # Services for Users
│   │   │       │   └── user.service.ts     # API calls for user data, MyPage data
│   │   │       └── types/      # TypeScript types specific to Users
│   │   │           └── user.types.ts       # e.g., IUserProfile, IMyPageData, User
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # General page-level components (if not fitting into domains)
│   │   │   ├── MainPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── OotdPage.tsx
│   │   │   ├── SocialOnboardingPage.tsx
│   │   │   └── SocialEmailRequestPage.tsx
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
├── docs/
│   ├── directory-structure.md  # This file
│   ├── tech-stack.md         # Project technology stack
│   ├── api-guide.md
│   ├── next-tasks.md
│   ├── PROJECT_STRUCTURE.md  # Detailed project structure (alternative view)
│   ├── introduce.md
│   ├── project_report.md
│   └── tasks/                # Task documentation files
│       ├── ootd-board-enhancement-task.mdc # OOTD board enhancement task documentation
│       └── weekly-top-ootd-api-task.mdc    # Weekly Top OOTD API implementation task
├── images/               # Project-wide images (not specific to client/src/assets)
├── node_modules/         # Project dependencies (managed by npm/yarn) - Root level
├── prompt/               # Prompts for AI assistant or other generation tasks
├── server/                 # Backend Node.js/Express Application
│   ├── public/             # Static files served by backend (e.g., uploaded images)
│   │   └── uploads/
│   │       └── posts/
│   │   ├── src/                # Source code for the backend
│   │   │   ├── config/         # Configuration files (db, cloudinary, etc.)
│   │   │   ├── controllers/    # Request handlers, business logic
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── post.controller.js  # Handles Post related CRUD and logic
│   │   │   │   ├── comment.controller.js # Handles Comment related CRUD and logic
│   │   │   │   └── user.controller.js
│   │   │   ├── middleware/     # Custom middleware
│   │   │   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   │   │   ├── upload.middleware.js
│   │   │   │   ├── avatarUpload.middleware.js # (If distinct from upload.middleware.js)
│   │   │   │   └── validators/
│   │   │   │       ├── post.validator.js
│   │   │   │       └── user.validator.js # Validators for user input
│   │   │   ├── models/         # Database models/schemas (Mongoose)
│   │   │   │   ├── User.js             # User schema (Corrected name)
│   │   │   │   ├── Post.model.js       # Post schema
│   │   │   │   └── Comment.model.js    # Comment schema
│   │   │   ├── routes/         # API route definitions
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── post.routes.js      # Routes for Post APIs
│   │   │   │   ├── comment.routes.js   # Routes for Comment APIs (typically nested under posts)
│   │   │   │   └── user.routes.js
│   │   │   ├── utils/          # Utility functions for backend
│   │   │   └── index.js        # Main entry point for the backend server
│   ├── .env                # Environment variables for backend
│   ├── .eslintignore
│   ├── .eslintrc.js
│   ├── .gitignore          # Specific to server if needed
│   ├── package.json
│   └── package-lock.json
├── src/                  # General source code (if not client or server specific)
├── 디자인 예시 사진/       # Design example images
├── .gitignore              # Root .gitignore
├── Palette 사업계획서.pdf
├── Palette_사업계획서_투자제안용.docx
├── Palette 프로젝트 로드맵.pdf
├── package.json            # Root package.json
├── package-lock.json       # Root package-lock.json
├── PROJECT_STRUCTURE.md    # Alternative/detailed project structure document
├── README.md
├── task-profile-page-frontend-setup.mdc
└── 코드 정리용 프롬프트.txt

```

## Notes:

*   This structure aims to clearly separate client and server concerns.
*   The `client/src/domains/` directory is for feature-based modules, promoting modularity.
*   The `domains/ootd/` module contains all OOTD-related components, services, and types.
*   Enhanced components for OOTD improvements are organized in `domains/ootd/components/enhanced/`.
*   Task documentation is stored in `docs/tasks/` for organized project management.
*   Shared components are in `client/src/components/`.
*   This document must be updated whenever significant changes are made to the directory structure.
