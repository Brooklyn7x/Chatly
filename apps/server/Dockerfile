FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY tsconfig.json .

RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 8000

CMD ["npm", "start"]