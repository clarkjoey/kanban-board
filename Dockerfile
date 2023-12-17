# Fetching the minified node image on apline linux
FROM arm32v7/node:18-alpine

# Create a directory for your application inside the container
WORKDIR /app

# Copy your server application files to the container
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy the rest of your server application files
COPY . .

# Expose the port your Express.js server will run on (assuming it's 3000)
EXPOSE 3000

# Define the command to start your Express.js server
CMD [ "node", "index.js" ]