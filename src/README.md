# 🛡️ AegisID | Frontend Client App

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen?style=for-the-badge)

Welcome to the user-facing presentation layer of **AegisID**.

This directory contains the highly responsive, lightning-fast frontend application that allows users to interact with our Decentralized Digital Identity ecosystem. Engineered for a seamless Web2-to-Web3 transition, this client bridges the gap between complex blockchain interactions and intuitive user experiences.

---

## 🏗️ Architecture & Tech Stack

Our frontend is built for speed, type safety, and modularity, utilizing modern tooling to deliver a production-ready Web3 experience:

* **Core Framework:** [React 18](https://reactjs.org/) powered by [Vite](https://vitejs.dev/) for sub-second HMR and optimized builds.
* **Language:** TypeScript for strict end-to-end type safety.
* **Styling:** Tailwind CSS for rapid, utility-first UI development and responsive design.
* **Web3 Integration:** Ethers.js / Wagmi (for connecting wallets, signing transactions, and interacting with smart contracts).
* **State Management:** React Context API & Custom Hooks (optimized to prevent unnecessary re-renders).
* **Routing:** React Router v6.

---

## 📂 Directory Structure

```text
frontend/
├── public/               # Static assets (images, icons, manifest)
├── src/
│   ├── assets/           # Global styles and localized assets
│   ├── components/       # Reusable, atomic UI components (Buttons, Modals, Navbars)
│   ├── contexts/         # React Context providers (Auth, Web3, Theme)
│   ├── hooks/            # Custom React hooks (e.g., useAuth, useContract)
│   ├── pages/            # Top-level route components (Dashboard, Login, Profile)
│   ├── services/         # API clients (Axios) and blockchain interactions
│   ├── utils/            # Helper functions and formatters
│   ├── App.tsx           # Root application component
│   └── main.tsx          # React DOM entry point
├── .env.example          # Environment variables template
├── index.html            # Vite HTML entry point
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript compiler configurations
└── package.json          # Dependencies and NPM scripts
```
# 🚀 Getting Started
### 1. Prerequisites
Ensure you have the following installed on your local machine:

* Node.js (v18.x or later)

* npm or yarn

* A Web3 Wallet extension (e.g., MetaMask) installed in your browser.

### 2. Installation
Navigate into the frontend directory and install all required dependencies:

```Bash
cd frontend
npm install
```
### 3. Configuration
Duplicate the .env.example file and rename it to .env. Configure your environment variables to connect the frontend to your local backend and blockchain network:

```Properties
# Vite requires custom environment variables to be prefixed with VITE_
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_BLOCKCHAIN_RPC_URL=[http://127.0.0.1:8545](http://127.0.0.1:8545)
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
VITE_NETWORK_ID=1337 # 1337 or 31337 for local Hardhat
```
### 4. Local Development
Start the Vite development server. It will typically be exposed on http://localhost:5173 with hot-module replacement (HMR) enabled:

```Bash
npm run dev
```
### 🛠️ Build & Deployment
When you are ready to prepare the application for production, Vite will bundle the assets and optimize the build:

1. Production Build
```Bash
npm run build
```
This compiles the application into the dist/ directory, minifying scripts and optimizing assets.

2. Preview Production Build
Test the production build locally before deploying:

```Bash
npm run preview
```
### 💅 Code Quality & Guidelines
To maintain a clean and consistent codebase, we enforce the following standards:

* Component Structure: Use functional components and ES6 arrow functions.

* Typing: Avoid any types. Define explicit interfaces/types for all props, API responses, and state objects.

* Styling: Keep inline styles to an absolute minimum; utilize Tailwind CSS utility classes.

* Linting: Run npm run lint before committing to ensure the code adheres to our ESLint and Prettier configurations.

### 🤝 Contributing
* 1.Ensure your local backend and local blockchain node are running before testing frontend features.

* 2.Create a new branch: git checkout -b feature/ui-dashboard-update.

* 3.Make your changes and verify them in the browser.

* 4.Commit your changes using Conventional Commits.

* 5.Submit a Pull Request targeting the main branch.
```
Built with 💻 and ☕ by Team HackVengers for SIH 2026.
```
