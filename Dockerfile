FROM node:20.12 AS build-stage

WORKDIR /skriper/app

ARG API_URL
ENV API_URL=${API_URL}

RUN echo "API_URL: $API_URL"

COPY app/package*.json ./
RUN npm install

COPY app/ .

RUN npm run build

FROM node:20.12 AS production-stage

WORKDIR /skriper/app

COPY --from=build-stage /skriper/app /skriper/app

RUN npm install --only=production

RUN ls -la

WORKDIR /skriper/server

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN ls -la


WORKDIR /skriper

COPY ecosystem.config.js .

# Install pm2 globally
RUN npm install pm2 -g

RUN ls -la
# Create /data folder
RUN mkdir /data

EXPOSE 3000 3001

CMD ["pm2-runtime", "ecosystem.config.js"]