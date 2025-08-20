# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Palette is a fashion community platform where users share their OOTD (Outfit of the Day), discover trends, and interact with other fashion enthusiasts. The project uses a React frontend with Material-UI and a Node.js/Express backend with MongoDB.

## Build Commands

### Frontend (client/)
- `cd client`
- `npm start` - Start development server (runs on http://localhost:3000)
- `npm run build` - Create production build
- `npm test` - Run tests with Jest

### Backend (server/)
- `cd server` 
- `npm run dev` - Start development server with nodemon (runs on http://localhost:5000)
- `npm start` - Start production server
- `npm test` - Run tests with Jest

### Full Stack Development
Run both frontend and backend simultaneously in separate terminals. Frontend is proxied to backend via `"proxy": "http://localhost:5000"` in client/package.json.

## Architecture

### Core Architecture Patterns
- **Feature-based organization**: Code is organized by domain/feature in `src/domains/` rather than just by file type
- **Component composition over props drilling**: Uses composition patterns to reduce coupling between components
- **Separation of concerns**: UI, business logic, and data management are clearly separated
- **Document-first approach**: All development begins with proper task documentation before code implementation

### Frontend Structure
- **React 18** with **TypeScript**
- **Material-UI (MUI)** for UI components with **Emotion** for styling
- **React Router DOM** for navigation
- **Zustand** for state management
- **React Hook Form** with **Zod** validation for forms
- **Axios** for API calls
- **Framer Motion** for animations

Key directories:
- `client/src/components/` - Shared/reusable components
- `client/src/domains/` - Feature-based organization (ootd, user, post)
- `client/src/pages/` - Page-level components
- `client/src/contexts/` - React contexts (AuthContext)
- `client/src/utils/` - Utility functions (API, validation, tokens)

### Backend Structure
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication with **bcryptjs** for password hashing
- **Multer** for file uploads
- **Express-validator** for request validation

Key directories:
- `server/src/controllers/` - Route handlers
- `server/src/models/` - Mongoose models
- `server/src/middleware/` - Custom middleware (auth, validation, upload)
- `server/src/routes/` - API route definitions
- `server/src/utils/` - Utility functions (email, social auth)

### State Management
- **Client-side**: Zustand for global state, React Context for auth
- **Server-side**: MongoDB for persistence, JWT for session management
- **API Integration**: Centralized API client in `utils/api.ts`

## Development Guidelines

### Code Quality Standards
Following `.cursor/rules/` specifications:

1. **Modularity**: Break code into smallest feasible, reusable units
2. **Single Responsibility**: Each component/function has one clear purpose  
3. **Composition over Inheritance**: Use component composition to avoid props drilling
4. **Named Constants**: Replace magic numbers with descriptive constants
5. **Predictable Returns**: Use consistent return types for similar functions
6. **Feature Organization**: Group related files by domain/feature, not just type

### Naming Conventions
- Components: PascalCase (e.g., `OOTDPost.tsx`)
- Files: Match component names, use kebab-case for utils (e.g., `token-utils.ts`)
- Functions: camelCase with descriptive names
- Constants: SCREAMING_SNAKE_CASE
- API endpoints: RESTful patterns (`/api/posts/:id`)

### Authentication Flow
- JWT tokens stored in localStorage via `tokenUtils.ts`
- Protected routes use `ProtectedRoute.tsx` component
- Social login supported for Google (`@react-oauth/google`) and Kakao
- Backend middleware validates tokens on protected endpoints

### File Upload System
- Images uploaded via `multer` middleware to `server/public/uploads/`
- Client uploads to `/api/posts` with multipart/form-data
- Avatar uploads handled separately via `avatarUpload.middleware.js`

## Common Tasks

### Adding New Features
1. Create task documentation in `docs/tasks/` following existing patterns
2. Implement in feature-based structure under `src/domains/`
3. Add necessary API endpoints in server
4. Update relevant documentation (`docs/PROJECT_STRUCTURE.md`, etc.)

### Testing
- Frontend: Jest + React Testing Library (commands in client/package.json)
- Backend: Jest (commands in server/package.json)
- No specific test runner scripts beyond standard `npm test`

### Database Operations
- Models in `server/src/models/` using Mongoose
- User, Post, Comment models implemented
- Local MongoDB development setup (connection via MONGODB_URI env var)

### Environment Variables
- Client: `REACT_APP_*` prefixed vars in `client/.env`
- Server: Standard env vars in `server/.env` (JWT_SECRET, MONGODB_URI, etc.)

## Key Integration Points

### Frontend-Backend Communication
- API base URL configured in `utils/api.ts`
- Axios interceptors handle token attachment and error responses
- Frontend proxy setup routes `/api/*` requests to backend

### Social Authentication
- Google: `@react-oauth/google` library with client ID configuration  
- Kakao: JavaScript SDK integration (not npm package)
- Server validates social tokens via `google-auth-library`

### File Handling
- Client uploads via multipart forms
- Server processes with `multer` middleware
- Images served statically from `server/public/uploads/`

## Documentation Requirements

All major changes must update:
- `docs/PROJECT_STRUCTURE.md` - Directory and component structure
- `docs/tech-stack.md` - Technology dependencies
- Task documentation in `docs/tasks/` - Feature specifications
- This `CLAUDE.md` file - Development guidance