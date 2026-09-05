# Contributing to AegisID

Thank you for your interest in contributing to **AegisID**.

AegisID is a blockchain-based secure platform for decentralized identity, access control, verifiable credentials, and digital asset management. The project combines a React/Vite frontend, Spring Boot backend, MySQL database, Solidity smart contracts, and an EVM-compatible local blockchain using Hardhat.

The goal of this document is to provide contributors with a clear understanding of the project structure, development workflow, and contribution guidelines.

---

## Project Architecture

AegisID consists of four major layers:

```text
React / Vite Frontend
        │
        │ REST API
        ▼
Spring Boot Backend
        │
        ├──────────────► MySQL Database
        │
        │ Web3j
        ▼
Solidity Smart Contract
        │
        ▼
Hardhat / EVM Blockchain
```

### Frontend

The frontend is built using:

* React
* TypeScript
* Vite
* CSS

The frontend communicates with the Spring Boot backend through REST APIs.

### Backend

The backend is built using:

* Java 17
* Spring Boot
* Spring Security
* JWT
* Maven
* Web3j

The backend handles authentication, authorization, identity management, credential management, digital assets, blockchain operations, and API integration.

### Database

MySQL is used for persistent application data, including:

* User information
* Identity metadata
* Credential data
* Roles and permissions
* Digital asset metadata
* Blockchain transaction records

Sensitive application data should remain off-chain.

### Blockchain

The blockchain layer uses:

* Solidity
* Hardhat
* EVM-compatible local blockchain
* Web3j

The blockchain is primarily used to maintain cryptographic proofs, hashes, ownership/status information, and transaction records.

Sensitive information such as passwords, private keys, and personal documents must never be stored directly on-chain.

---

## Repository Structure

```text
AegisID/
│
├── blockchain/
│   ├── contracts/
│   │   └── AegisIDRegistry.sol
│   ├── ignition/
│   │   └── modules/
│   │       └── AegisIDRegistry.ts
│   ├── hardhat.config.ts
│   └── package.json
│
├── backend/
│   └── backend/
│       ├── pom.xml
│       └── src/
│           └── main/
│               ├── java/
│               └── resources/
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── package.json
└── README.md
```

---

## Setting Up the Project

### Prerequisites

Install the following:

* Node.js
* npm
* Java 17+
* Maven or use the included Maven Wrapper
* MySQL
* Git

---

## Running the Blockchain

Navigate to the blockchain directory:

```bash
cd blockchain
npm install
```

Start the local Hardhat blockchain:

```bash
npx hardhat node
```

The local blockchain runs at:

```text
http://127.0.0.1:8545
```

The default Hardhat chain ID is:

```text
31337
```

Keep the blockchain terminal running while developing.

If the blockchain is reset and the smart contract is redeployed, make sure the backend uses the updated contract address.

---

## Running the Backend

Navigate to:

```bash
cd backend/backend
```

Using the Maven Wrapper on Windows:

```bash
.\mvnw.cmd spring-boot:run
```

Or, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend normally runs at:

```text
http://localhost:8080
```

The health endpoint is:

```text
/api/health
```

---

## Running the Frontend

From the project root:

```bash
npm install
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

## Development Workflow

Before making changes:

```bash
git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

Make your changes, test them locally, and commit your work:

```bash
git add .
git commit -m "Add meaningful description of change"
```

Push your branch:

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request.

---

## Contribution Areas

Contributions can be made in several areas.

### Frontend

Examples:

* Improving React components
* Improving UI/UX
* Integrating new backend APIs
* Improving blockchain verification displays
* Fixing frontend bugs
* Improving responsive design

### Backend

Examples:

* REST API improvements
* Authentication and authorization
* RBAC and permissions
* Identity management
* Credential management
* Digital asset management
* Blockchain integration
* API validation and error handling

### Blockchain

Examples:

* Smart contract improvements
* Blockchain interaction logic
* Transaction handling
* Hash verification
* Identity anchoring
* Credential anchoring
* Asset anchoring
* Blockchain integrity verification

### Testing

Contributors are encouraged to add tests for:

* Backend APIs
* Authentication and authorization
* Blockchain operations
* Credential verification
* Asset verification
* Frontend functionality
* End-to-end workflows

---

## Blockchain Verification Principles

AegisID uses cryptographic hashes to provide tamper-evident verification.

A simplified flow is:

```text
Identity / Credential / Asset
            │
            ▼
       Generate Hash
            │
            ▼
    Anchor Hash On-Chain
            │
            ▼
      Blockchain Record
            │
            ▼
       Verify Later
            │
            ▼
Compare Current Hash
with On-Chain Hash
```

The purpose of this mechanism is to verify that the relevant data has not been modified without authorization.

Contributors working on verification logic should preserve the consistency between:

1. Data stored by the application
2. Generated cryptographic hash
3. Blockchain record
4. Verification result

---

## API Integration

The frontend should communicate with the backend through the documented REST API.

Important API groups include:

```text
/api/auth/*
/api/users/*
/api/identities/*
/api/credentials/*
/api/assets/*
/api/blockchain/*
/api/health
```

Blockchain-related operations include:

```text
GET  /api/blockchain/status
GET  /api/blockchain/contract

GET  /api/blockchain/identity/{identityHash}
POST /api/blockchain/identity/anchor

GET  /api/blockchain/credential/{credentialHash}
POST /api/blockchain/credential/anchor
GET  /api/blockchain/credential/{credentialId}/verify

GET  /api/blockchain/asset/{assetHash}
POST /api/blockchain/asset/anchor
PUT  /api/blockchain/asset/{assetHash}/status
PUT  /api/blockchain/asset/{assetHash}/owner
```

Frontend implementations should treat backend API responses as the source of truth.

---

## Security Guidelines

Security is a core part of AegisID.

### Never commit:

* Passwords
* Database credentials
* JWT secrets
* Blockchain private keys
* Production API keys
* Other sensitive credentials

Use environment variables for secrets.

Example configuration variables include:

```text
JWT_SECRET
DB_USERNAME
DB_PASSWORD
BLOCKCHAIN_RPC_URL
BLOCKCHAIN_CONTRACT_ADDRESS
BLOCKCHAIN_PRIVATE_KEY
```

Never store passwords, private keys, or sensitive personal documents on the blockchain.

---

## Commit Guidelines

Use clear and descriptive commit messages.

Good examples:

```text
feat: add credential verification flow
feat: integrate blockchain asset anchoring
fix: resolve JWT authorization issue
fix: correct blockchain transaction status
refactor: improve credential service
ui: improve asset verification interface
test: add blockchain verification tests
docs: update contributor documentation
```

Avoid vague messages such as:

```text
update
changes
final
new code
fixed stuff
```

---

## Pull Request Guidelines

Before submitting a Pull Request:

* Ensure the project builds successfully.
* Test the affected functionality.
* Verify that the frontend can communicate with the backend.
* Verify blockchain functionality when applicable.
* Do not commit secrets or credentials.
* Keep changes focused on the purpose of the Pull Request.
* Provide a clear description of what was changed.

A Pull Request should explain:

1. What was changed?
2. Why was it changed?
3. How was it tested?
4. Are there any known limitations?

---

## Testing Checklist

For changes affecting the complete application, verify:

```text
[ ] MySQL is running
[ ] Hardhat blockchain is running
[ ] Spring Boot backend starts successfully
[ ] /api/health returns successfully
[ ] Authentication works
[ ] JWT-protected APIs work
[ ] Blockchain status can be retrieved
[ ] Blockchain read operations work
[ ] Blockchain write operations create transactions
[ ] Verification operations return the expected result
[ ] Frontend can communicate with the backend
```

---

## Code Quality

Contributors should:

* Keep functions focused and readable.
* Avoid unnecessary duplication.
* Validate user input.
* Handle errors appropriately.
* Avoid exposing sensitive information.
* Follow the existing project structure.
* Prefer maintainable solutions over unnecessarily complex implementations.

---

## Reporting Bugs

When reporting a bug, include:

* Description of the problem
* Steps to reproduce
* Expected behavior
* Actual behavior
* Relevant error messages
* Environment information
* Whether the issue occurs in the frontend, backend, database, or blockchain layer

Do not include passwords, private keys, API keys, or other secrets in bug reports.

---

## Feature Requests

Feature requests are welcome.

A useful feature request should explain:

* The problem being solved
* The proposed functionality
* Why the feature is useful
* Which part of the system it affects
* Any possible security or architectural considerations

---

## Development Philosophy

AegisID follows a separation-of-concerns approach:

```text
Sensitive Application Data
        │
        ▼
     MySQL
        │
        │
Cryptographic Proofs / Integrity
        │
        ▼
    Blockchain
```

The blockchain should provide verifiable integrity rather than being used as a replacement for the application's primary database.

---

## License

AegisID is released under the MIT License.

By contributing to this project, you agree that your contributions may be distributed under the project's applicable license.
