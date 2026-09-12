# Contributing to AegisID

First off, thank you for considering contributing to **AegisID**! 

AegisID is a prototype built for the **Smart India Hackathon (SIH) 2026**, focusing on decentralized identity, verifiable credentials, role-based access control, and blockchain-backed digital asset management. We welcome contributions that help improve the platform's security, system architecture, performance, and features.

## 📋 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [Getting Started](#-getting-started)
3. [How Can I Contribute?](#-how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Pull Requests](#pull-requests)
4. [Development Guidelines](#-development-guidelines)
5. [Commit Message Convention](#-commit-message-convention)

---

## 📜 Code of Conduct

By participating in this project, you are expected to uphold a welcoming, inclusive, and collaborative environment. 
* **Be respectful:** Treat all contributors with respect. Harassment or abusive behavior will not be tolerated.
* **Be constructive:** Provide helpful and constructive feedback during code reviews and issue discussions.
* **Focus on the goal:** Keep conversations focused on improving AegisID and achieving the project objectives for SIH 2026.

---

## 🚀 Getting Started

Before you begin contributing, ensure you have the local development environment set up correctly. AegisID requires three main services to run concurrently:

1. **Blockchain Network:** Hardhat local node for deploying and testing smart contracts.
2. **Backend API:** Java 17 + Spring Boot (handling core business logic, decentralized identity management, and robust error handling).
3. **Frontend UI:** React + Vite + TypeScript.

**Setup Steps:**
1. Fork the repository and clone it locally: `git clone https://github.com/YOUR_USERNAME/AegisID.git`
2. Navigate to the respective directories (`/blockchain`, `/backend`, `/frontend`) and install the necessary dependencies (e.g., `npm install`, `mvn clean install`).
3. Set up your environment variables by copying the `.env.example` to `.env` in the required directories.
4. Refer to the Local Setup section in our `README.md` for detailed installation commands.

---

## 🛠️ How Can I Contribute?

There are several ways you can contribute to this project, whether it's fixing a typo, optimizing backend architecture, or writing smart contracts.

### Reporting Bugs

If you find a bug or experience a system failure, please open an issue in the repository. Include the following details to help us debug effectively:
* **Title:** A clear and descriptive title.
* **Steps to Reproduce:** Exact steps to trigger the bug.
* **Expected vs. Actual Behavior:** What you thought would happen vs. what actually happened.
* **Logs & Screenshots:** Any relevant server logs, console errors, or screenshots.
* **Environment:** Your OS, Node version, Java version, and browser.

### Suggesting Enhancements

Have an idea to make AegisID more secure, scalable, or user-friendly? Open an issue using the "Enhancement" label and provide:
* **Feature Summary:** A clear explanation of the feature.
* **Use Case:** The problem it solves or the value it adds specifically to the SIH prototype (e.g., better rate limiting, improved RBAC flow).
* **Implementation Ideas:** Any thoughts on how this could be implemented in the backend or frontend.

### Pull Requests

Ready to write some code? Follow these steps to submit a Pull Request (PR):
1. **Sync your fork:** Ensure your fork is up to date with the `main` branch of the upstream repository.
2. **Create a branch:** Use a descriptive name (`git checkout -b feature/jwt-auth-update` or `git checkout -b fix/contract-reentrancy`).
3. **Make changes:** Write clean, modular code.
4. **Test:** Ensure all existing and new tests pass.
5. **Submit PR:** Push your branch and open a PR against the `main` branch. Provide a detailed description of your changes and link any relevant issues.

---

## 💻 Development Guidelines

To maintain a high-quality codebase, please adhere to the following standards:

* **Backend (Java / Spring Boot):** 
  * Prioritize clean software architecture and separation of concerns (Controllers, Services, Repositories).
  * Implement comprehensive error handling and proper HTTP status codes for the REST APIs.
  * Ensure secure database transactions and avoid N+1 query problems.
* **Blockchain (Solidity / Hardhat):**
  * Follow smart contract security best practices (e.g., protecting against reentrancy, integer overflow).
  * Write comprehensive unit tests for all smart contracts using Chai/Ethers.js.
* **Frontend (React / TypeScript):**
  * Write reusable functional components.
  * Keep the state management clean and minimize unnecessary re-renders.

---

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification to keep the commit history clean and automated. Please structure your commit messages as follows:

`<type>(<optional scope>): <description>`

**Types:**
* `feat`: A new feature (e.g., `feat(auth): implement JWT validation`)
* `fix`: A bug fix (e.g., `fix(contract): resolve role-based access denial`)
* `docs`: Documentation changes only (e.g., `docs: update CONTRIBUTING.md`)
* `style`: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc.)
* `refactor`: A code change that neither fixes a bug nor adds a feature (e.g., optimizing backend logic)
* `test`: Adding or correcting tests
* `chore`: Updating build tasks, package manager configs, etc.

**Example:**
`feat(backend): add global exception handler for API rate limiting`
