FROM node:18.14-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18.14-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
RUN npm install --production=true

FROM public.ecr.aws/lambda/nodejs:18 AS runner
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/index.js .
COPY --from=installer /app/node_modules ./node_modules

CMD [ "index.handler" ]