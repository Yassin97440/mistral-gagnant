FROM node:18-alpine as build-env
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

FROM node:18-alpine as prod-env
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build-env /app/.nuxt /app/.nuxt
COPY --from=build-env /app/.output /app/.output
EXPOSE 3000
CMD ["npm", "run", "start"]