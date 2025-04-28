# 1. Use the official Node.js base image
FROM node:22

# 2. Set the working directory inside the container
WORKDIR /src/app

# 3. Copy package.json and package-lock.json (only dependency info)
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of your backend code into the container
COPY . .

# 6. Build your TypeScript code
RUN npm run build

# 7. Expose the port your app runs on (example: 5000)
EXPOSE 3000

# 8. Start the app using compiled JavaScript
CMD ["npm", "run", "dev"]