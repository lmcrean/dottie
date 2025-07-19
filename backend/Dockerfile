# Use Node.js LTS Alpine image for smaller size and security
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . ./

# Create directories and set ownership
RUN mkdir -p logs && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]