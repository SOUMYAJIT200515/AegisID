# Frontend (src)

This folder contains the frontend application for AegisID.

## Overview

AegisID frontend provides the web interface for the project. The frontend is implemented primarily with TypeScript and standard web tooling.

## Tech stack

- TypeScript
- (Likely) React or another TypeScript-friendly framework
- Node.js / npm or Yarn for package management

> Note: If the project uses a specific framework (React, Next.js, Vue) or a specific package manager, update the commands below accordingly.

## Prerequisites

- Node.js v16+ (or the version used by this project)
- npm or Yarn

## Setup

1. Install dependencies

```bash
# using npm
npm install

# or using yarn
# yarn install
```

2. Start development server

```bash
# using npm
npm run dev

# or using yarn
# yarn dev
```

3. Build for production

```bash
npm run build
# or
# yarn build
```

4. Run tests (if present)

```bash
npm test
# or
# yarn test
```

## Environment variables

If the frontend requires environment variables, create a `.env` file in the `src` folder or the project root (depending on how the project is configured) and add variables like:

```
REACT_APP_API_URL=http://localhost:3000
# or
VITE_API_URL=http://localhost:3000
```

Adjust variable names to match the framework/tooling used.

## Project structure (example)

- src/
  - components/  - UI components
  - pages/ or routes/ - application pages or routes
  - styles/ - styles and assets
  - utils/ - helper utilities
  - index.tsx or main.tsx - app entry

Update this section to reflect the actual layout of this repository.

## Linting & Formatting

If the project uses ESLint and Prettier, run:

```bash
npm run lint
npm run format
```

## Contributing

- Follow existing code styles and patterns.
- Run linting and tests before opening PRs.
- Provide a clear description of changes and how to test them.

## Where to update this README

This README is intentionally generic. Please edit `src/README.md` to add framework-specific commands (e.g., `npm run dev` vs `next dev`) and any required environment variables, build steps, or deployment instructions specific to this frontend.
