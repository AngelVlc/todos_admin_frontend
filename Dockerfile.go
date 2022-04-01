FROM node:14.1.0-alpine3.11 as base

ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=${BACKEND_URL}
ENV APP /app
WORKDIR $APP

COPY package.json $APP
COPY yarn.lock $APP

RUN npm install

COPY . $APP

RUN npm run-script build

FROM golang:1.17.7-alpine3.15 as golang_base

ENV APP /go/src
WORKDIR $APP

RUN apk add -u build-base

COPY server/go.mod $APP
COPY server/go.sum $APP

RUN go mod download

COPY server/. $APP

FROM golang_base as golang_build

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /go/bin/app .

FROM alpine as release

COPY --from=golang_build /go/bin/app /server/
COPY --from=base /app/build/ /build/

CMD [ "/server/app" ]
