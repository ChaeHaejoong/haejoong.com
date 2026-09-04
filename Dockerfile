FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS builder

WORKDIR /usr/src/app

# Copy manifests first so dependency installation can be cached.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json ./shared/package.json
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY shared ./shared
COPY backend ./backend
COPY frontend ./frontend

RUN pnpm --filter @haejoong.com/shared exec tsc -p tsconfig.json
RUN pnpm --filter backend build
ARG VITE_ASSET_BASE_URL
ENV VITE_ASSET_BASE_URL=${VITE_ASSET_BASE_URL}
RUN pnpm --filter frontend build

# Create a production-only workspace for the API.
RUN pnpm deploy --filter backend --prod --legacy /prod/backend

FROM base AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app/backend

COPY --from=builder /prod/backend ./
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/frontend/dist ./public

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
