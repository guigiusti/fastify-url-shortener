FROM oven/bun:latest

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./

RUN bun install --production

COPY src ./src
COPY public.pem ./public.pem

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]