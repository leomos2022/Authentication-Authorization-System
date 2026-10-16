FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port via environment variable (Spaceship Hyperlift requirement)
ENV PORT=3000
EXPOSE $PORT

# Run as non-root user for security
USER node

CMD ["node", "./bin/www"]
