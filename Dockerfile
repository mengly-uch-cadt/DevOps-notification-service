# Use Node.js LTS
FROM node:18-alpine


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
