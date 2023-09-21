FROM node:18.17.1-alpine

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml", "./"]
COPY [".env", "./"]

RUN npm install -g pnpm
RUN pnpm install 

COPY . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]