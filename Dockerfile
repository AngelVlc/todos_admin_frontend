FROM node:14.1.0-alpine3.11 as base

ENV APP /app
WORKDIR $APP

COPY package.json $APP
COPY yarn.lock $APP

RUN npm install

COPY . $APP

RUN npm run-script build

FROM node:14.1.0-alpine3.11 as release

ENV APP /app
WORKDIR $APP

RUN yarn global add serve

COPY --from=base /app/build/ /app/

CMD ["serve", "-s", "."]

