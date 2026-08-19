FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY shared/package.json ./shared/package.json
COPY shared/package-lock.json ./shared/package-lock.json
RUN cd shared && npm ci
COPY shared ./shared
RUN cd shared && npx tsc -p tsconfig.json

COPY backend/package.json ./backend/package.json
COPY backend/package-lock.json ./backend/package-lock.json
RUN cd backend && npm ci
COPY backend ./backend
RUN cd backend && npm run build

COPY frontend/package.json ./frontend/package.json
COPY frontend/package-lock.json ./frontend/package-lock.json
RUN cd frontend && npm ci
COPY frontend ./frontend
ARG VITE_ASSET_BASE_URL
ENV VITE_ASSET_BASE_URL=${VITE_ASSET_BASE_URL}
RUN cd frontend && npm run build

FROM node:24-alpine AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY shared/package.json ./shared/package.json
COPY shared/package-lock.json ./shared/package-lock.json
COPY --from=builder /usr/src/app/shared/dist ./shared/dist
RUN cd shared && npm ci --omit=dev

COPY backend/package.json ./backend/package.json
COPY backend/package-lock.json ./backend/package-lock.json
RUN cd backend && npm ci --omit=dev

COPY --from=builder /usr/src/app/backend/dist ./backend/dist
COPY --from=builder /usr/src/app/frontend/dist ./backend/public

WORKDIR /usr/src/app/backend
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
