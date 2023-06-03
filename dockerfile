# Use a base Node.js image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the NestJS application will listen on
EXPOSE 8000

# Set the command to start the NestJS server
CMD ["npm", "run", "start"]