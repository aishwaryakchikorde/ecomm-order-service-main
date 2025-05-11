# Use Node LTS as base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port (match your service.js port)
EXPOSE 5002

# Start the service
CMD [ "npm", "start" ]
