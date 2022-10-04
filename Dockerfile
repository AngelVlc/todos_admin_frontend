FROM node:18.10.0-alpine3.16 as base

ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=${BACKEND_URL}
ENV APP /app
WORKDIR $APP

COPY package.json $APP
COPY yarn.lock $APP

RUN npm install

COPY . $APP

RUN npm run-script build

FROM node:18.10.0-alpine3.16 as release

ENV APP /app
WORKDIR $APP

RUN yarn global add serve

COPY --from=base /app/build/ /app/

CMD ["serve", "-s", "."]

