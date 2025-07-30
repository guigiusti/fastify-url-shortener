FROM oven/bun:latest

RUN addgroup --system app && adduser --system --ingroup app --home /app --shell /sbin/nologin app

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./

RUN bun install --production

COPY --chown=app:app src ./src
COPY --chown=app:app public.pem ./public.pem
COPY --chown=app:app db.json ./data/db.json

USER app

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "src/server.ts"]