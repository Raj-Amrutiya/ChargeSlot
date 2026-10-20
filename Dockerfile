# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Install backend production dependencies
FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY --from=frontend-builder /frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "src/server.js"]
