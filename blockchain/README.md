# 🛡️ AegisID | Blockchain Core

![Solidity](https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black)
![Hardhat](https://img.shields.io/badge/Hardhat-2.x-yellow?style=for-the-badge&logo=hardhat)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen?style=for-the-badge)

Welcome to the decentralized nervous system of **AegisID**. 

This directory contains the core smart contracts, deployment scripts, and testing suites that power our Decentralized Digital Identity and Access Management platform. Built with security and scalability in mind, this architecture ensures immutable, tamper-proof identity verification on the blockchain.

---

## 🏗️ Architecture & Tech Stack

Our smart contract infrastructure is engineered for production-grade reliability using the industry standard toolchain:

* **Framework:** [Hardhat 3](https://hardhat.org/) (Minimal & unopinionated)
* **Language:** Solidity & TypeScript
* **Testing:** Mocha + Chai (via Hardhat toolchain)
* **Deployment:** Hardhat Ignition

---

## 📂 Directory Structure

```text
blockchain/
├── contracts/        # Core Solidity Smart Contracts (.sol)
├── ignition/         # Hardhat Ignition deployment modules
├── scripts/          # Standalone execution and interaction scripts
├── test/             # Comprehensive unit and integration tests
├── hardhat.config.ts # Network configurations and compiler settings
└── package.json      # Dependencies and execution scripts
```
### 🚀 Getting Started
# 1. Prerequisites
Ensure you have the following installed on your local machine:
* Node.js (v18.x or later)
* npm or yarn
# 2. Installation
Navigate into the blockchain directory and install the required dependencies:
```text
cd blockchain
npm install
```
# 3. Compilation
Compile the smart contracts to generate the ABI and bytecode artifacts:
```text
npx hardhat compile
```
# 4. Testing
We take security seriously. Run our test suite to validate contract logic and guard against vulnerabilities:
```text
npx hardhat test
```
5. Local Deployment
Spin up a local Hardhat node to test the contracts in an isolated environment:
```text
# Terminal 1: Start the local blockchain
npx hardhat node

# Terminal 2: Deploy using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/AegisIDModule.ts --network localhost
```
### 🔒 Security Posture
* Access Control: Strict Role-Based Access Control (RBAC) implemented within the contracts.

* Type Safety: 100% end-to-end type safety using TypeScript for tests and scripts.

* Gas Optimization: Contracts are actively audited to minimize execution costs without compromising security.
```
Built with 💻 and ☕ by Team HackVengers for SIH 2026.
```


