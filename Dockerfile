FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app ./

EXPOSE 3000

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run start"]
