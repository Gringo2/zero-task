
# Deployment Guide: Render

This guide details how to deploy **ZERO-TASK** as two separate services on [Render](https://render.com).

## 1. Prerequisites

- A GitHub repository containing this code.
- A Render account.
- A hosted PostgreSQL database (Render provides a managed PostgreSQL service).

## 2. Deploy the Database (PostgreSQL)

1.  In Render dashboard, click **New +** -> **PostgreSQL**.
2.  **Name**: `zero-task-db`
3.  **Database**: `zero_task`
4.  **User**: `zero_user`
5.  **Region**: Choose closest to you (e.g., Oregon, Frankfurt).
6.  **Plan**: Free (for hobby/testing) or Standard.
7.  Click **Create Database**.
8.  **Copy the "Internal Database URL"** (for backend if in same region) or "External Database URL".

## 3. Deploy the Backend (Web Service)

1.  Click **New +** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Name**: `zero-task-server`
4.  **Root Directory**: `.` (leave empty or use default)
5.  **Runtime**: `Node`
6.  **Build Command**:
    ```bash
    npm install && npm run build -w apps/server
    ```
7.  **Start Command**:
    ```bash
    node apps/server/dist/index.js
    ```
8.  **Environment Variables**:
    - `DATABASE_URL`: *(Paste the PostgreSQL URL from Step 2)*
    - `BETTER_AUTH_SECRET`: *(Generate a long random string)*
    - `BETTER_AUTH_URL`: `https://your-backend-service-name.onrender.com`
    - `FRONTEND_URL`: `https://your-frontend-service-name.onrender.com` *(You will get this URL in Step 4)*.
    - `NODE_ENV`: `production`

9.  Click **Create Web Service**.

## 4. Deploy the Frontend (Static Site)

1.  Click **New +** -> **Static Site**.
2.  Connect your GitHub repository.
3.  **Name**: `zero-task-web`
4.  **Root Directory**: `.`
5.  **Build Command**:
    ```bash
    npm install && npm run build -w apps/web
    ```
6.  **Publish Directory**: `apps/web/dist`
7.  **Environment Variables**:
    - `VITE_API_URL`: `https://your-backend-service-name.onrender.com` *(The URL from Step 3)*.

8.  Click **Create Static Site**.

## 5. Final Configuration

1.  After the Frontend is deployed, copy its URL (e.g., `https://zero-task-web.onrender.com`).
2.  Go back to the **Backend Web Service** -> **Environment**.
3.  Update (or add) `FRONTEND_URL` with the actual frontend URL.
4.  Render will automatically redeploy the backend.

## 6. Verification

- Navigate to your frontend URL.
- Try to Sign Up.
- Ensure tasks can be created and persisted (checking network tab for calls to your backend URL).
