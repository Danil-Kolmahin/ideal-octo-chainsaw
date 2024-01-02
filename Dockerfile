FROM docker.io/node:20.10.0-alpine

ARG APP_NAME

WORKDIR /app

RUN addgroup --system dev && adduser --system --ingroup dev dev

COPY dist/apps/${APP_NAME} dev
COPY package*.json dev
RUN chown -R dev:dev .

RUN npm --prefix dev --omit=dev i

CMD [ "npm", "serve-build-app" ]
