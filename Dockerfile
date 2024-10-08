FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
    WORKDIR /app

    # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
    RUN apk add --no-cache libc6-compat

    # Install dependencies based on the preferred package manager
    COPY package.json package-lock.json ./
    RUN npm clean-install

# Rebuild the source code only when needed
FROM base AS builder
    WORKDIR /app

    COPY --from=deps /app/node_modules ./node_modules
    COPY . .

    RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
    WORKDIR /app

    ENV NODE_ENV production

    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    USER nextjs

    #COPY --from=builder /app/public ./public

    # Automatically leverage output traces to reduce image size
    # https://nextjs.org/docs/advanced-features/output-file-tracing
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

    EXPOSE 3000

    ENV PORT=3000
    ENV HOSTNAME "0.0.0.0"

    # server.js is created by next build from the standalone output
    # https://nextjs.org/docs/pages/api-reference/next-config-js/output
    CMD node server.js
