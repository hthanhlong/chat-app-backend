# Use Node.js LTS (Long Term Support) as the base image
FROM node:22.14.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Start the application
CMD [ "node", "dist/server.js" ]