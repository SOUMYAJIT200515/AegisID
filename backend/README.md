# 🛡️ AegisID | Core Backend Architecture (v1)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Welcome to the central processing engine of **AegisID**. 

This repository contains the backend microservices (TypeScript and Java) and the foundational Solidity smart contracts that power our decentralized digital identity platform. Engineered for scalability, security, and real-time synchronization, this system bridges traditional web services with on-chain identity primitives.

---

## 🏗️ High-Level Architecture & Tech Stack

AegisID operates on a polyglot microservices architecture to maximize performance and security:

* **API Gateway & Fast I/O:** **TypeScript / Node.js** handles high-throughput REST/GraphQL endpoints, lightweight data transformations, and asynchronous workers.
* **Core Business Logic:** **Java (Spring Boot)** microservices process complex workflows, enforce deep authorization rules, and manage heavy background processing.
* **Blockchain Layer:** **Solidity** smart contracts deployed on EVM-compatible networks handle verifiable credentials and identity anchoring.
* **Persistence & Caching:** **PostgreSQL** for relational metadata and **Redis** for distributed caching and job queues.
* **Infrastructure:** **Docker & Docker Compose** for streamlined containerization and local orchestration.

---

## 📂 Backend Folder Layout

The system is compartmentalized into domain-specific subdirectories:

```text
backend/
├── README.md              # This architecture documentation
├── ts-api/                # Node.js/TypeScript REST & GraphQL API 
├── java-service/          # Spring Boot Microservice
├── contracts/             # Solidity Smart Contracts & Hardhat tooling
├── scripts/               # Global deployment and CI/CD helper scripts
└── docker/                # Dockerfiles and docker-compose configurations
```
#⚙️ Prerequisites
To run this environment locally, ensure you have the following installed:

* Node.js (LTS, v18+) & npm/yarn

* Java Development Kit (JDK) (v17+) & Maven/Gradle

* Docker & Docker Compose (Highly recommended for DB/Redis simulation)

* PostgreSQL & Redis (If not using Docker)

* An EVM-compatible RPC provider (for smart contract interactions)

# 🔐 Environment Variables
Each service requires specific environment variables. Create a .env file in the respective service directories (ts-api, java-service, contracts) based on their .env.example templates.

Common Global Variables:

```Properties
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/aegisid
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
WEB3_PROVIDER_URL=[https://rpc.mychain.example](https://rpc.mychain.example)
CONTRACT_ADDRESS=0xYourDeployedContractAddress
ETH_NETWORK=goerli # or mainnet, localhost
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=debug
```
# 🚀 Local Development Workflow
To boot the complete backend, you will typically run the services in parallel using separate terminal instances.

### 1. TypeScript API (Node.js)
Navigate to the ts-api directory to start the Node gateway:

```Bash
cd ts-api
npm install
npm run dev # Starts server with nodemon/ts-node for hot-reloading
```
### 2. Java Service (Spring Boot)
Navigate to the java-service directory to boot the Java engine:

```Bash
cd java-service
mvn clean package
mvn spring-boot:run
```
### 3. Smart Contracts (Solidity/Hardhat)
Navigate to the contracts directory to manage local blockchain state:

```Bash
cd contracts
npm install
npx hardhat compile
# Terminal A: Start local node
npx hardhat node

# Terminal B: Deploy contracts locally
npx hardhat run scripts/deploy.js --network localhost
```
# 🧪 Testing
We enforce strict test coverage across all stacks. Run tests locally or configure your CI/CD pipelines to execute these before merging:

* TypeScript: npm test (or yarn test) inside ts-api/

* Java: mvn test (or ./gradlew test) inside java-service/

* Solidity: npx hardhat test inside contracts/

# 🐳 Docker & Production Build
Containerization
Each service includes a Dockerfile for seamless deployment.

```Bash
# Build the TypeScript Image
docker build -t aegisid-ts-api:latest ./ts-api

# Build the Java Service Image
docker build -t aegisid-java-service:latest ./java-service
```
Orchestration
To spin up the entire ecosystem (DB, Redis, TS API, Java Service) instantly:

```Bash
cd docker
docker-compose up -d
```
Note: Ensure your secrets (DB credentials, JWT keys) are securely injected using K8s Secrets, HashiCorp Vault, or robust environment management in production.

# 🛠️ Troubleshooting
* Database Connection Errors: Verify your DATABASE_URL and ensure the Postgres container/service is running.

* Smart Contract Reverts: Double-check that your CONTRACT_ADDRESS matches the most recent deployment artifact and that you are connected to the correct ETH_NETWORK.

* Port Conflicts: If localhost:3000 or localhost:8080 are in use, remap them in your .env or docker-compose.yml.

# 🗺️ Roadmap
[ ] Phase 1: Implement Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs).

[ ] Phase 2: Add event-driven synchronization between on-chain events and off-chain caching.

[ ] Phase 3: Integrate traditional identity providers (OIDC/SAML) for seamless web2 to web3 onboarding.

[ ] Phase 4: Establish automated CI/CD deployment pipelines via GitHub Actions.

# 🤝 Contributing
We welcome contributions to make AegisID more secure and robust!

* 1.Fork the repository.

* 2.Create a feature branch (git checkout -b feature/amazing-feature).

* 3.Run all linters and tests locally.

* 4.Commit your changes using Conventional Commits.

* 5.Open a Pull Request detailing your changes and testing steps.

# 📄 License & Contact
License: MIT License (See LICENSE file at repo root).

Maintainer: HackVengers

Repository: AegisID GitHub Repo

```
Built with 💻 and ☕ by Team HackVengers for SIH 2026.
```
