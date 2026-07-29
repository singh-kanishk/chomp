# ==========================================
# Stage 1: Prune the workspace for the target app
# ==========================================
FROM node:26-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g turbo
COPY . .
# Extracts only the packages/apps needed for 'backend'
RUN turbo prune backend --docker

# ==========================================
# Stage 2: Install dependencies and build
# ==========================================
FROM node:26-alpine AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm turbo

# First install dependencies (this layer caches well)
# turbo prune --docker isolates package.jsons to out/json
COPY --from=builder /app/out/json/ .
RUN pnpm install --no-frozen-lockfile

# Now copy the pruned source code and build
COPY --from=builder /app/out/full/ .

RUN turbo run build --filter=backend...

# ==========================================
# Stage 3: Minimal production runner
# ==========================================
FROM node:26-alpine AS runner
WORKDIR /app

# Security: Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend-user
USER backend-user

# Copy over the built application from the installer stage
COPY --from=installer --chown=backend-user:nodejs /app .

EXPOSE 3000

# Adjust this path based on where 'backend' lives in your monorepo
# (e.g., apps/backend/dist/index.js)
CMD ["node", "apps/backend/dist/index.js"]