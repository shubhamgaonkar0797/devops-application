# Use Node.js 22 as the base image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install application dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set application port
EXPOSE 8082

# Start the application
CMD ["npm", "start"]
