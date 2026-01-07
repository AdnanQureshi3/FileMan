FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY ServerSide ./ServerSide
COPY prisma ./prisma

EXPOSE 3000
CMD ["node","ServerSide/index.js"]

