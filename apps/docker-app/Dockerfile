FROM node:18 as builder
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
COPY . .
RUN npm run build:api

FROM node:18-alpine3.18 as runner 
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install --production
COPY --from=builder /app/dist/apps/docker-app /app
CMD ["node", "main.js"]
