# QuickChat Complete Project

This is a completed full-stack QuickChat project built with:
- React + Vite
- Node.js + Express
- MongoDB
- Socket.io

## Features
- User registration and login
- JWT authentication
- Contact list
- One-to-one chat creation
- Real-time messaging with Socket.io
- MongoDB message storage
- Clean responsive UI
- Docker support

## Project Structure

```bash
quickchat-complete/
  client/
  server/
  docker-compose.yml
```

## Run Locally

### 1) Start MongoDB
Use local MongoDB or Docker.

### 2) Server
```bash
cd server
npm install
npm run dev
```

### 3) Client
```bash
cd client
npm install
npm run dev
```

## Run with Docker
```bash
docker-compose up --build
```

## Default URLs
- Client: http://localhost:5173
- Server API: http://localhost:5000/api

## Important Fixes Done
- Flat broken file structure converted into proper `client/src` and `server/src` folders.
- Server imports fixed (`config`, `routes`, `models`, `middleware`).
- Chat routes completed.
- Socket connection stabilized.
- Duplicate message handling improved.
- Better chat UI added.
- Environment files and Docker setup added.

## Notes
- Change `JWT_SECRET` before production use.
- For local non-Docker MongoDB, update `server/.env` to:
```env
MONGO_URI=mongodb://localhost:27017/quickchat
```
