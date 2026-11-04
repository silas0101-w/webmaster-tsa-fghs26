FROM node:20-bookworm-slim

WORKDIR /app

# Install native compilation dependencies for bcrypt and sqlite3
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Directory where persistent volume will be mounted
RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=8080
ENV DATABASE_PATH=/data/database.sqlite

EXPOSE 8080

CMD ["node", "index.js"]