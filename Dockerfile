# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Remove dev dependencies after build (optional, for smaller image)
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
