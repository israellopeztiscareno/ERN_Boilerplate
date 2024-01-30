FROM node:18-alpine AS base

# 1. Install dependencies
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN npm install

# 2. Build
FROM base AS builder
# Environment variables for builder
# Compilación
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Production image
FROM base AS runner
# Environment variables for runner
# Ejecución
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
RUN mkdir -p src/server/tmp
RUN chown -R  nodeuser src/server/tmp

RUN apk --no-cache add curl

COPY --from=builder --chown=nodeuser:nodejs /app ./

EXPOSE 3000

USER nodeuser

CMD [ "npm", "run", "start" ]