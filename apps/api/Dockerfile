FROM docker.io/node:20.10.0

WORKDIR /app

RUN addgroup --system dev && adduser --system -G dev dev

COPY dist/apps/dev dev
COPY package*.json dev
RUN chown -R dev:dev .

RUN npm --prefix dev --omit=dev -f install

CMD [ "node", "dev/main.js" ]
