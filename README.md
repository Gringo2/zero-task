# ZERO-TASK: The Auditable Task Engine

Zero-Task is a lightweight, single-page task management application built with **React 19**, **TypeScript**, and **Vite**. It follows the "System Zero" methodology, emphasizing auditability, deterministic state, and containment.

## Features

- **Auditability**: All actions (Add, Edit, Toggle, Delete) are tracked and verifiable.
- **Persistence**: Automatic state hydration and saving to browser `localStorage`.
- **Search & Filtering**: Live search by title/description and status filtering (All/Active/Completed).
- **Glassmorphism UI**: Premium dark-mode aesthetic with modern CSS tokens.
- **Testing**: Comprehensive test suite using Vitest and React Testing Library.

## Getting Started

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Run Tests**:
   ```bash
   npm run test
   ```

### Production Deployment (Containment)

The project is fully containerized for deterministic deployment.

1. **Build and Run with Docker**:
   ```bash
   docker build -t zero-task .
   docker run -p 8080:80 zero-task
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:8080`.

### Automated Staging Deployment

The project includes automated deployment to staging via GitHub Actions.

**Setup Instructions**:

1. **Create a Render Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select "Docker" as the runtime
   - Deploy the service

2. **Configure Deploy Hook**:
   - In Render service settings, navigate to "Deploy Hook" section
   - Copy the Deploy Hook URL
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add new secret: `RENDER_DEPLOY_HOOK` with the copied URL

3. **Automatic Deployment**:
   - Every push to `main` branch will:
     1. Run tests and linting
     2. Build the application
     3. Trigger Render deployment (if secret is configured)

**Manual Deployment**:
```bash
# Trigger deployment manually from GitHub Actions tab
# Navigate to "Deploy to Staging" workflow → "Run workflow"
```

## Documentation

The application uses a **Composition Root** pattern in `App.tsx`, with a custom hook `useTasks` managing the core logic and persistence.

- **Storage**: Browser `localStorage` (Key: `zero-task-data`)
- **State Flow**: Unidirectional data flow from `useTasks` -> `App` -> `Components`.
- **Verification**: Automated CI/CD via GitHub Actions (`verify.yml`) for linting, testing, and building.

## System Zero Principles

This project serves as a proof-of-concept for "System Zero" engineering:
1. **Self-Contained**: No external database required (Client-side sovereignty).
2. **Auditable**: Simple, readable code with 100% logic coverage.
3. **Immutable History**: Logic preserved through Git commits and tracking logs.
