FROM node:18 as build
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build:ui

FROM node:18-alpine as production
WORKDIR /app
COPY --from=build /app/dist/apps/ui-docker-app /app
RUN npm i --omit=dev
CMD ["npm", "start"]