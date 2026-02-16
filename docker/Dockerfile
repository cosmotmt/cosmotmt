FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g wrangler

EXPOSE 3000 8788

CMD ["npm", "run", "dev"]
