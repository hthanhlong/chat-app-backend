# Use Node.js LTS (Long Term Support) as the base image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source code
COPY . .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Start the application
CMD [ "node", "app.js" ]