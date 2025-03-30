FROM node:20-alpine AS frontend-build
WORKDIR /app/client
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY client/ .
RUN pnpm run build

FROM golang:1.23-alpine AS backend-build
WORKDIR /app
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libavif-dev \
    libde265-dev \
    x265-dev

COPY go.mod go.sum ./
RUN go mod download
COPY cmd/ ./cmd/
COPY internal/ ./internal/
COPY --from=frontend-build /app/internal/server/dist ./internal/server/dist
RUN CGO_ENABLED=1 GOOS=linux go build -o /app/server ./cmd/api

FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache \
    libc6-compat \
    libavif \
    libde265 \
    x265

COPY --from=backend-build /app/server .

EXPOSE 8080

CMD ["./server"]

