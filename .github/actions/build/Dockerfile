# Use the official Node.js 10.19 image as a parent image
FROM node:10.19

# Create a directory to hold the application code inside the image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the application
RUN npm run build

# Copy environment-specific files
COPY src/env.js dist/

# Set up redirects
RUN echo '/* /index.html 200' > dist/_redirects

# Create a non-root user and give them ownership of the relevant directories
RUN groupadd -r nodeuser && useradd -r -g nodeuser -d /usr/src/app -s /sbin/nologin nodeuser \
    && chown -R nodeuser:nodeuser /usr/src/app

# Switch to the non-root user
USER nodeuser

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]
CMD npm ci && npm run build && cp src/env.js dist && echo '/* /index.html 200' > dist/_redirects