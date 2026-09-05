# ⛓️ AegisID — Blockchain Module

> **Smart Contracts & Hardhat Configuration for Decentralized Identity & Asset Management**

The blockchain module contains the Solidity smart contracts and Hardhat configuration used by AegisID to anchor identity, verifiable credentials, and digital asset records on the Ethereum Virtual Machine (EVM).

---

## 📋 Overview

The `blockchain/` directory houses:

- **Solidity Smart Contracts** — `AegisIDRegistry.sol` and related contracts
- **Hardhat Configuration** — EVM network setup, compilation, deployment, and testing
- **Ignition Modules** — Deployment automation and contract initialization
- **Deployment Scripts** — Helper scripts for network interaction

This module is responsible for:

✅ Registering identity hashes with blockchain-backed proofs  
✅ Anchoring verifiable credentials on-chain  
✅ Managing digital asset records and ownership transfers  
✅ Recording transaction history and gas usage  
✅ Verifying integrity through on-chain state  

---

## 🧰 Technology Stack

| Component | Technology |
|-----------|------------|
| Smart Contract Language | Solidity |
| Development Framework | Hardhat |
| EVM Network | Local Hardhat Node (Chain ID: 31337) |
| Web3 Client | ethers.js (v6.x) |
| Crypto | ethereum-cryptography |
| TypeScript Compilation | TypeScript (v6.0.3) |
| Node Runtime | Node.js 18+ |

---

## 📁 Project Structure

```
blockchain/
├── contracts/
│   ├── AegisIDRegistry.sol          ← Main smart contract
│   └── ... (other contracts if any)
├── ignition/
│   └── modules/
│       └── AegisIDRegistry.ts        ← Hardhat Ignition deployment module
├── scripts/
│   ├── deploy.js / deploy.ts        ← Custom deployment script (optional)
│   └── ... (other helper scripts)
├── hardhat.config.ts                 ← Hardhat configuration
├── package.json                      ← Dependencies
├── tsconfig.json                     ← TypeScript configuration
├── .gitignore                        ← Git ignore rules
└── README.md                         ← This file
```

---

## 🚀 Quick Start

### 1. Prerequisites

Install globally or ensure availability:

```bash
node --version      # v18+ required
npm --version       # LTS version
```

### 2. Install Dependencies

```bash
cd blockchain
npm install
```

This installs:

- `hardhat` — Ethereum development framework
- `ethers` — Web3 library for contract interaction
- `@nomicfoundation/hardhat-ethers` — Hardhat ethers plugin
- `@nomicfoundation/hardhat-ignition` — Hardhat Ignition plugin
- `typescript` — TypeScript compiler

### 3. Start Local Blockchain

```bash
npx hardhat node
```

**Output:**

```text
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545

Accounts (10 available) with 10000 ETH each:
Account #0: 0x1234...
Account #1: 0x5678...
...

Network ID: 31337
Chain ID: 31337
```

⚠️ **Keep this terminal running** while developing.

---

## 🔧 Common Commands

### Compile Contracts

```bash
npx hardhat compile
```

Compiles all Solidity contracts in `contracts/` to ABI and bytecode.

Output: `artifacts/contracts/`

### Deploy Contracts

#### Option A: Using Hardhat Ignition (Recommended)

```bash
npx hardhat ignition deploy ignition/modules/AegisIDRegistry.ts --network localhost
```

#### Option B: Using Custom Deploy Script

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**

```text
AegisIDRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

⚠️ **Save the contract address** — the backend needs it.

### Run Tests

```bash
npx hardhat test
```

Runs all test files (`.test.ts` or `.test.js`) in the `test/` directory (if present).

### Verify Contract Code

```bash
npx hardhat verify --network <network> <contract-address> <constructor-args>
```

### Clean Artifacts

```bash
npx hardhat clean
```

Removes compiled artifacts and cache.

---

## 📝 Hardhat Configuration

**File:** `hardhat.config.ts`

Key sections:

```typescript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545"
  },
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}

solidity: {
  version: "0.8.x"      // Adjust to contract version
}
```

---

## ⛓️ Smart Contract: AegisIDRegistry

### Purpose

The `AegisIDRegistry` smart contract maintains on-chain records for:

1. **Identities** — SHA-256 hashes of user identity data
2. **Credentials** — Verifiable credential hashes with lifecycle metadata
3. **Assets** — Digital asset records with ownership and status

### Core Data Structures

```solidity
struct IdentityRecord {
  bytes32 hash;              // SHA-256 hash of identity
  address owner;             // Wallet address
  uint256 timestamp;         // Registration timestamp
  bool active;               // Active / inactive status
}

struct CredentialRecord {
  bytes32 hash;              // Credential hash
  address issuer;            // Credential issuer
  uint256 issuedAt;          // Issuance timestamp
  uint256 expiresAt;         // Expiration timestamp (0 = no expiry)
  bool revoked;              // Revoked status
}

struct AssetRecord {
  bytes32 hash;              // Asset hash
  address owner;             // Current owner
  uint256 mintedAt;          // Minting timestamp
  bool active;               // Active / revoked status
}
```

### Key Functions

#### Identity Management

```solidity
function registerIdentity(bytes32 _hash, address _owner) public
function getIdentity(bytes32 _hash) public view returns (IdentityRecord)
function updateIdentityStatus(bytes32 _hash, bool _active) public
```

#### Credential Management

```solidity
function registerCredential(bytes32 _hash, uint256 _expiresAt) public
function getCredential(bytes32 _hash) public view returns (CredentialRecord)
function revokeCredential(bytes32 _hash) public
function verifyCredential(bytes32 _hash) public view returns (bool)
```

#### Asset Management

```solidity
function mintAsset(bytes32 _hash, address _owner) public
function getAsset(bytes32 _hash) public view returns (AssetRecord)
function transferAsset(bytes32 _hash, address _newOwner) public
function revokeAsset(bytes32 _hash) public
```

---

## 🌐 Interacting with the Blockchain

### Using Hardhat Console

```bash
npx hardhat console --network localhost
```

**Example:**

```javascript
const registry = await ethers.getContractAt("AegisIDRegistry", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

// Register an identity
const hash = ethers.id("user@example.com");
await registry.registerIdentity(hash, "0x1234...");

// Get identity
const identity = await registry.getIdentity(hash);
console.log(identity);
```

### Using Ethers.js (Backend Integration)

```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const contract = new ethers.Contract(contractAddress, ABI, provider);

// Read identity
const identity = await contract.getIdentity(identityHash);
console.log(identity.owner, identity.active);
```

---

## 🔗 Backend Integration (Web3j)

The backend uses **Web3j** to interact with this smart contract:

1. Backend listens on `http://127.0.0.1:8545` (Hardhat node URL)
2. Backend queries contract state (read operations)
3. Backend submits transactions (write operations) using a private key
4. Transactions are signed and submitted to the Hardhat node
5. Gas usage and transaction hashes are recorded in MySQL

**Backend Configuration (Java):**

```properties
blockchain.rpc.url=http://127.0.0.1:8545
blockchain.contract.address=0x5FbDB2315678afecb367f032d93F642f64180aa3
blockchain.chain.id=31337
blockchain.private.key=${BLOCKCHAIN_PRIVATE_KEY}
```

---

## 📊 Example Flow

### 1. User Creates an Identity

```
React Frontend
  │
  └─→ Backend API: POST /api/identities
       │
       └─→ Spring Boot
            ├─ Compute SHA-256 hash
            ├─ Store identity in MySQL
            └─ Web3j Contract Call
                 │
                 └─→ registerIdentity(hash, ownerAddress)
                      │
                      └─→ Hardhat Node (EVM)
                           │
                           └─→ AegisIDRegistry.sol
                                ├─ Store IdentityRecord
                                └─ Emit IdentityRegistered event
                                
Return: TransactionHash, BlockNumber, GasUsed
```

### 2. Verify Identity Integrity

```
Backend: GET /api/blockchain/identity/{identityHash}
  │
  └─→ Web3j
       │
       └─→ Call getIdentity(identityHash)
            │
            └─→ Hardhat Node returns IdentityRecord
                 │
                 └─→ Return: owner, timestamp, active status
                 
Frontend displays: "Identity verified on-chain ✓"
```

---

## 🔐 Network Configuration

### Local Development (Hardhat)

| Property | Value |
|----------|-------|
| Network Name | localhost |
| RPC URL | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Currency | ETH |
| Block Time | ~1 second (in `hardhat node`) |

### Pre-funded Accounts

Hardhat provides 20 accounts with 10,000 ETH each. Use the first account for deployment:

```bash
Account #0:
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d544c1e8902f2ccf5ffb
```

---

## 🧪 Testing Smart Contracts

### Create Test File

**File:** `test/AegisIDRegistry.test.ts`

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AegisIDRegistry", () => {
  let registry: any;
  let owner: any;

  beforeEach(async () => {
    const Registry = await ethers.getContractFactory("AegisIDRegistry");
    registry = await Registry.deploy();
    [owner] = await ethers.getSigners();
  });

  it("should register an identity", async () => {
    const hash = ethers.id("test@example.com");
    await registry.registerIdentity(hash, owner.address);
    
    const identity = await registry.getIdentity(hash);
    expect(identity.owner).to.equal(owner.address);
    expect(identity.active).to.be.true;
  });
});
```

### Run Tests

```bash
npx hardhat test
```

---

## 📦 Deployment to Testnet (Example: Sepolia)

### 1. Set Environment Variables

Create `.env` file:

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_WITHOUT_0x_PREFIX
```

### 2. Update Hardhat Config

```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### 3. Deploy

```bash
npx hardhat ignition deploy ignition/modules/AegisIDRegistry.ts --network sepolia
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'hardhat'"

**Solution:**

```bash
npm install
```

### Issue: "Connection refused at 127.0.0.1:8545"

**Solution:** Ensure Hardhat node is running:

```bash
npx hardhat node
```

### Issue: "Contract not deployed at address"

**Solution:** Verify the contract address matches the deployment output:

```bash
npx hardhat ignition deploy ignition/modules/AegisIDRegistry.ts --network localhost
```

### Issue: "Transaction reverted"

**Solution:** Check:

- ✅ Contract address is correct
- ✅ Account has sufficient balance
- ✅ Contract is deployed to the specified network
- ✅ Function arguments are correct type

---

## 📚 Resources

- [Hardhat Official Docs](https://hardhat.org/)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/)

---

## 📄 License

AegisID blockchain module is licensed under the **MIT License**.

Copyright (c) 2026 Soumyajit Saha

---

## 👥 Contact

For questions or issues with the blockchain module:

- **Repository:** https://github.com/Spandan2106/AegisID
- **Issue Tracker:** https://github.com/Spandan2106/AegisID/issues
- **Maintainer:** Spandan2106

---

## 🚀 Next Steps

1. ✅ Start Hardhat node: `npx hardhat node`
2. ✅ Deploy contracts: `npx hardhat ignition deploy ...`
3. ✅ Save contract address to backend `.env`
4. ✅ Run backend: `mvn spring-boot:run`
5. ✅ Start frontend: `npm run dev`
6. ✅ Test end-to-end flow

Happy hacking! 🔗⚡
