# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: runtime ----
FROM nginxinc/nginx-unprivileged:1.30-alpine AS runtime

# Passage temporaire en root pour la mise à jour des paquets Alpine
USER root
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# Copy hardened nginx config (no server_tokens, security headers, gzip, SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Only the compiled static assets are shipped — no source code, no node_modules, no secrets.
COPY --from=build /app/dist /usr/share/nginx/html

# nginx-unprivileged already runs as non-root (uid 101) and listens on 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

# Retour à l'utilisateur non-root pour l'exécution
USER 101

CMD ["nginx", "-g", "daemon off;"]