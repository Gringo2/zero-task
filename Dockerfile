# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy workspace configurations
COPY package.json package-lock.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (monorepo root handles this)
RUN npm install

# Copy source code
COPY . .

# Build all packages (shared, then server/web)
RUN npm run shared:build && npm run web:build && npm run build -w apps/server

# Production Stage
FROM node:20-slim

WORKDIR /app

# Copy production dependencies and built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/package.json ./package.json

EXPOSE 5001

ENV NODE_ENV=production

# Start the server by default
CMD ["node", "apps/server/dist/index.js"]
