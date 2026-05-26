FROM node:20-alpine AS build

WORKDIR /app

COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm --prefix backend install
RUN npm --prefix frontend install

COPY backend ./backend
COPY frontend ./frontend

RUN npm --prefix frontend run build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

COPY backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist

EXPOSE 8080

CMD ["node", "backend/server.js"]
