FROM node:24-alpine AS builder

WORKDIR /svoyak

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /svoyak

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /svoyak/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
