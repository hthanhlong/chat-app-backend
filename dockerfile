# Production
# # Use Node.js LTS (Long Term Support) as the base image
FROM node:22-alpine AS production

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

RUN npm run build

# Start the application
CMD [ "npm", "run", "production" ]


# Development
FROM node:22.14.0-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
