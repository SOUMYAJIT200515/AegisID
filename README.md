# 🛡️ AegisID

> **Blockchain-Based Secure Platform for Identity, Access Control, and Digital Asset Management**

AegisID is a security-focused digital identity and asset management platform that combines **secure authentication, fine-grained authorization, decentralized identity, verifiable credentials, digital asset management, and blockchain-based integrity verification**.

The project is being developed as an **SIH 2026 prototype for Problem Statement SIH26125**.

---

# 🚀 Key Features

## 🔐 Authentication & Security

- JWT-based authentication
- Spring Security integration
- BCrypt password hashing
- Protected REST APIs
- User account status enforcement
- WebAuthn integration
- Token-based API authentication

---

## 👥 Role & Permission Management

AegisID uses a combination of **roles and fine-grained permissions**.

```text
User
  ↓
User Role
  ↓
Role
  ↓
Role Permission
  ↓
Permission
  ↓
Spring Security Authority
