# Zeeky Core - Multi-stage Docker build
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS build
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    curl

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S zeeky -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=build --chown=zeeky:nodejs /app/dist ./dist
COPY --from=build --chown=zeeky:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=zeeky:nodejs /app/package*.json ./

# Create necessary directories
RUN mkdir -p /app/logs /app/data /app/temp
RUN chown -R zeeky:nodejs /app

# Switch to non-root user
USER zeeky

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]