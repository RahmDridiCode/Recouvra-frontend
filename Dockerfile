# Stage 1: Build Angular application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Angular application (production mode)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Configuration Nginx :
# - nginx.conf     : Docker Compose (proxy /api vers le service recouvra-backend)
# - nginx.k8s.conf : Kubernetes (sans proxy, /api est routé par l'Ingress)
#   Activée dans Kubernetes avec : command: ["nginx","-c","/etc/nginx/nginx.k8s.conf","-g","daemon off;"]
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.k8s.conf /etc/nginx/nginx.k8s.conf

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from builder
COPY --from=builder /app/dist/recouvra-frontend/browser /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx_user && \
    adduser -S nginx_user -u 1001 && \
    chown -R nginx_user:nginx_user /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
