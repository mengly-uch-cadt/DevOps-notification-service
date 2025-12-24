

# Use Node.js LTS (Debian for OpenSSL compatibility)
FROM node:18-bullseye


WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy Prisma schema before generating client
COPY prisma ./prisma
RUN npx prisma generate


COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]
