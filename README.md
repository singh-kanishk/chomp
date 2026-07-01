# Chomp - Zero-Knowledge Credential Vault

Chomp is a highly secure, zero-knowledge password and credential management platform built with modern web technologies. All encryption and decryption happen strictly in the browser using Web Crypto API and Web Workers, ensuring that only blinded ciphertext is ever stored on the server.

## 🏗 Architecture

This repository is built as a **Turborepo** monorepo using `pnpm` workspaces.

### Packages & Apps
* **`apps/client`**: A Vite + React (TypeScript) frontend. Utilizes Zustand for client-side state, React Query for server synchronization, React Hook Form, and Shadcn UI (TailwindCSS). Cryptographic operations are offloaded to a Comlink Web Worker (`hash.ts`).
* **`apps/backend`**: A Node.js backend. Serves a RESTful API to store encrypted vaults, validate users, and manage sessions. Uses PostgreSQL for persistent storage.
* **`packages/shared`**: A shared library for Zod validation schemas, TypeScript interfaces, and API payload definitions used by both the client and the backend.

### Zero-Knowledge Cryptography
1. Users generate a local RSA key pair or derive an AES-GCM symmetric key from their master passphrase.
2. The `client` encrypts credentials directly in a background worker thread.
3. The `backend` receives only encrypted payload blobs (`credentialData`). The server can never decrypt your vault.

---

## 🚀 Development Setup

1. **Install dependencies**: 
   ```bash
   pnpm install
   ```
2. **Start the database** (Optional if using Docker Compose, or have a local PostgreSQL running on port 5433).
3. **Start the development servers**:
   ```bash
   pnpm run dev
   ```
   This will spin up both the Vite dev server (`http://localhost:5173`) and the backend API (`http://localhost:3000`) simultaneously.

4. **Build the project**:
   ```bash
   pnpm run build
   ```

---

## 🐳 Deployment (Podman / Docker)

For production deployment strategies using multi-stage Docker builds and Nginx, please refer to the dedicated [Containerization Guide](./DOCKER_GUIDE.md).