FROM node:16-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install pnpm -g; \ 
    pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]