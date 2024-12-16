FROM node:20.12 AS build-stage

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ .

RUN npm run build

FROM node:20.12 AS production-stage

WORKDIR /app

COPY --from=build-stage /app /app

RUN npm install --only=production


WORKDIR /server

COPY server/package*.json ./

RUN npm install

COPY server/ .


WORKDIR /

COPY ecosystem.config.js .

# Install pm2 globally
RUN npm install pm2 -g

# Create /data folder
RUN mkdir /data

EXPOSE 3000 3001

CMD ["pm2-runtime", "ecosystem.config.js"]