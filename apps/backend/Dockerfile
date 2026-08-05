# ==========================================
# Stage 1: Prune workspace for the target app
# ==========================================
FROM node:26-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install global tools matching the project's exact version
RUN npm install -g pnpm@10.33.0 turbo@^2

COPY . .
# Isolates only the files required for the target app
RUN turbo prune backend --docker

# ==========================================
# Stage 2: Install dependencies & Build
# ==========================================
FROM node:26-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Tell tools we are in an automated build
ENV CI=true
ENV COREPACK_ENABLE_STRICT=0

RUN npm install -g pnpm@10.33.0 turbo@^2

# First, install dependencies using cached pruned JSON files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Leverage strict lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Copy source code and build the targeted package
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Set node environment for production optimizations during build
ENV NODE_ENV=production
RUN pnpm turbo run build --filter=backend...

# NEW: Use pnpm deploy to magically isolate the backend and its production dependencies!
# This automatically resolves all workspace symlinks (like @chomp/shared) and strips devDependencies!
RUN pnpm --filter backend deploy /app/out/deploy --prod --legacy

# ==========================================
# Stage 3: Minimal production runner
# ==========================================
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create unprivileged system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejsuser

# Copy ONLY the fully deployed, isolated app!
COPY --from=builder --chown=nodejsuser:nodejs /app/out/deploy .

USER nodejsuser

EXPOSE 3000

# Point directly to your built bundle (it sits at the root of the deployed folder)
CMD ["node", "dist/index.js"]