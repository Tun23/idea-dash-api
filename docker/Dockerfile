FROM node:12.22-alpine as builder

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile --ignore-optional

RUN yarn nest build

FROM node:12.22-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock .

RUN yarn --production=true --frozen-lockfile --ignore-optional

COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD [ "yarn","prod" ]