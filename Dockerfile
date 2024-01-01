FROM docker.io/node:20.10.0

ARG APP_NAME

WORKDIR /app

RUN addgroup --system dev && adduser --system --ingroup dev dev

COPY dist/apps/${APP_NAME} dev
COPY package*.json dev
COPY node_modules/ dev
RUN chown -R dev:dev .

WORKDIR /app/dev

CMD [ "npm start" ]
