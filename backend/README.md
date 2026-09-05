# AegisID — Backend (v1)

AegisID is a decentralized identity platform. This repository contains the backend components (TypeScript and Java services) and Solidity contracts used by the system.

This README documents the backend folder: architecture, setup, development and deployment steps, testing, and common environment variables.

> Note: This README is written to cover typical project layouts present in this backend folder (Node/TypeScript service(s), Java service(s), and Solidity contracts). Adjust paths and commands below to match the exact subfolder names and tooling in your repo.

## Table of contents
- Project overview
- Tech stack
- Architecture
- Backend folder layout
- Prerequisites
- Environment variables
- Local development
  - TypeScript (Node)
  - Java
  - Solidity (contracts)
- Testing
- Build & production
- Docker
- Contributing
- License
- Contact

## Project overview
AegisID provides identity-related services combining traditional backend APIs (TypeScript/Java) with blockchain-backed identity primitives (Solidity). The backend exposes REST/GraphQL endpoints, handles authentication/authorization, persists metadata, and interacts with on-chain contracts for identity verification and credential anchoring.

## Tech stack
- TypeScript / Node.js (API, workers)
- Java (additional services / microservices)
- Solidity (smart contracts)
- PostgreSQL / other relational DB (example)
- Redis (caching, job queues)
- Hardhat or Truffle for contract development
- Docker for containerization

## Architecture (high level)
- API layer: TypeScript Node services exposing HTTP/GraphQL endpoints
- Business layer: Java microservice(s) for heavier workflows, background processing
- Persistence: Relational DB (e.g., PostgreSQL) and cache (Redis)
- Blockchain layer: Solidity smart contracts deployed to EVM-compatible networks; Node services interact with the chain via web3/ethers
- Worker/queue: background jobs for long-running tasks (email, indexing, on-chain watchers)

## Backend folder layout (example)
Adjust these paths to match the repository:
- backend/
  - README.md (this file)
  - ts-api/                -> TypeScript Node API (package.json)
  - java-service/          -> Java service (pom.xml or build.gradle)
  - contracts/             -> Solidity contracts (Hardhat/Truffle config)
  - scripts/               -> deployment / helper scripts
  - docker/                -> Docker-related files

## Prerequisites
Install these locally:
- Node.js (LTS, e.g., 18+)
- npm or yarn
- Java (11+ if using Spring Boot)
- Maven or Gradle (if using Maven/Gradle)
- Docker & docker-compose (optional)
- PostgreSQL (or your chosen DB)
- Redis (optional)
- Hardhat/Truffle & an Ethereum-compatible RPC (for contract dev)

## Environment variables
Common variables the backend services may expect (replace/extend for your codebase):
- NODE_ENV=development|production
- PORT=3000
- DATABASE_URL=postgres://user:pass@host:port/dbname
- REDIS_URL=redis://host:port
- JWT_SECRET=your_jwt_secret
- WEB3_PROVIDER_URL=https://rpc.mychain.example
- CONTRACT_ADDRESS=0x...
- ETH_NETWORK=goerli|mainnet|local
- SENTRY_DSN=...
- LOG_LEVEL=info|debug

Create a `.env` file in each service directory or set these in your deployment environment.

## Local development

General approach: open one terminal per service (TypeScript, Java, contracts) and run each service in dev mode.

### TypeScript (Node) service
1. Change to the TypeScript service folder. Example:
   cd backend/ts-api

2. Install dependencies:
   npm install
   # or
   yarn install

3. Start development server (watch mode):
   npm run dev
   # or
   yarn dev

4. Build and run production:
   npm run build
   npm start

Notes:
- If `package.json` scripts differ, use the actual script names in your repo (e.g., `start:dev`, `dev`, `watch`).
- Use ts-node / nodemon for hot reload in development.

### Java service
If the Java service uses Maven:
1. Change to the Java folder:
   cd backend/java-service

2. Build & run:
   mvn clean package
   mvn spring-boot:run
   # or run the jar:
   java -jar target/<artifact>.jar

If Gradle:
   ./gradlew bootRun

Adjust commands according to your build system.

### Solidity contracts
If contracts are in `backend/contracts` and use Hardhat:
1. cd backend/contracts
2. Install:
   npm install
3. Compile:
   npx hardhat compile
4. Run tests:
   npx hardhat test
5. Deploy to local network (example with Hardhat node):
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost

If Truffle is used, substitute with `truffle compile`, `truffle test`, `truffle migrate`.

## Testing
- TypeScript:
  npm test
  # or
  yarn test

- Java:
  mvn test
  # or
  ./gradlew test

- Solidity:
  npx hardhat test
  # or truffle test

Configure CI to run these commands on pushes and pull requests.

## Build & production
- Build each service (TypeScript: `npm run build`, Java: `mvn package`).
- Build Docker images for each service and deploy using your orchestration of choice (Kubernetes, Docker Compose, ECS, etc.).
- Ensure secrets (DB URL, JWT secret, keys) are injected securely (K8s secrets, Vault, or env management).

Example Docker Compose skeleton:
- backend/docker/docker-compose.yml
  - postgres
  - redis
  - ts-api
  - java-service
  - optionally a contract-local network

## Docker
If you have Dockerfiles in each service folder:
- Build:
  docker build -t aegisid-ts-api:latest ./backend/ts-api
  docker build -t aegisid-java-service:latest ./backend/java-service

- Run:
  docker run --env-file backend/ts-api/.env -p 3000:3000 aegisid-ts-api:latest

Consider multi-stage builds to produce smaller production images.

## Contributing
- Fork the repo and create a feature branch: feature/your-feature
- Run tests and linters locally before opening PRs
- Follow existing code style and commit message conventions
- Describe the change clearly in the PR and include testing steps

## Useful scripts & tips
- Add `check` scripts to run linters and tests in CI (eslint, prettier, mvn check)
- Use environment-specific `.env.example` files documenting required variables
- Add migration tooling (Flyway / Liquibase for Java, TypeORM migrations or Prisma for TypeScript)

## Troubleshooting
- DB connection errors: verify DATABASE_URL and that the DB is reachable
- Smart contract issues: confirm network and contract address match deployed artifacts
- Port conflicts: ensure services use different ports or map them in docker-compose

## Roadmap (examples)
- Implement DID support and verifiable credentials
- Add event-driven sync between on-chain events and off-chain state
- Integrate third-party identity providers (OIDC/SAML)
- Add automated deployment pipelines

## License
Specify your project license here (e.g., MIT). If none, add a LICENSE file at the repo root.

## Contact
Maintainer: Spandan2106
Repo: https://github.com/Spandan2106/AegisID

If you want, I can:
- Add this README to the repository (commit it to backend/README.md).
- Generate a `README.md` at the repo root that links into backend and other subfolders.
- Inspect the backend folder and tailor the README with exact service names, scripts, and env vars.
