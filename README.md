# Relay Chat

A real-time chat application built with React, Node.js (Express), Socket.io and MongoDB.

- **Live app:** https://relay-chat-zeta.vercel.app
- **Live API:** https://relay-chat-api-f3ph.onrender.com (health check: [/api/health](https://relay-chat-api-f3ph.onrender.com/api/health))

> The backend runs on Render's free plan, which sleeps when idle. The first request after a while can take up to a minute.

## Project setup

Requirements:

- Node.js 20 or newer
- A MongoDB database (for example a free MongoDB Atlas cluster)

Clone the repository:

```bash
git clone https://github.com/sumansinha1729/vedaz.git
cd vedaz
```

The project has two folders: `server` (backend) and `client` (frontend).

## Steps to run the backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in the values in `server/.env` (see below), then start the server:

```bash
npm run dev
```

The API runs on http://localhost:5050. Check it with http://localhost:5050/api/health.

## Steps to run the frontend

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. To try the real-time features, open the app in two different browsers and log in with two usernames.

## Environment variables required

**Backend (`server/.env`)**

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign login tokens (at least 32 characters) |
| `CLIENT_URL` | No | Frontend URL allowed by CORS. Default: `http://localhost:5173` |
| `PORT` | No | Server port. Default: `5050` |
| `NODE_ENV` | No | `development` or `production`. Default: `development` |
| `JWT_EXPIRES_IN` | No | Token lifetime. Default: `7d` |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend (`client/.env`)**

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend URL. Default: `http://localhost:5050` |

## Design decisions

- **Layered backend.** Code is split into routes, controllers, services and models. The REST API and the Socket.io handlers both call the same services, so the logic for saving and broadcasting messages lives in one place.
- **REST + Socket.io.** REST is used for login and loading chat history. Socket.io is used for everything live: new messages, typing, online status and read receipts. Sending a message over REST also broadcasts it to connected users.
- **Instant sending with retry.** A message appears as soon as it is sent, with a temporary id created in the browser. The server confirms it through a socket acknowledgement. If the socket is disconnected, the app sends it through the REST API instead. A failed message shows a retry button. A unique database index on that temporary id means a retry can never create a duplicate.
- **Cursor pagination for history.** Older messages are loaded with `?before=<messageId>` instead of skip/limit. This stays fast on every page and doesn't produce duplicates when new messages arrive while scrolling.
- **JWT authentication.** Login returns a signed token. It is sent in the `Authorization` header for REST requests and in the Socket.io handshake, where it is verified before the connection is accepted.
- **Online status per tab.** The server tracks each user's open connections, so a user stays online until their last tab is closed.
- **Batched read receipts.** Delivered and read updates are grouped and sent together, instead of one request per message. A message is marked as read only when it is visible on screen and the browser tab is active.
- **Validation and security.** All input is validated with Zod. The server uses helmet, CORS limited to the frontend URL, and rate limits on login and message sending. Every error is returned in the same JSON format.

## Assumptions made

- Login only needs a username (no password). Usernames are case-insensitive.
- There is one group chat (General) that everyone joins. One-to-one direct messages are also supported.
- Messages are plain text, up to 1000 characters.
- In the group chat, a message counts as delivered or read when at least one other user has received or seen it.
- The backend runs as a single server instance, because online status is kept in server memory.

## Bonus features implemented

- [x] Username-based login (dummy authentication)
- [x] Typing indicator
- [x] Online/offline user status
- [x] Message delivered/read status
- [x] Messages stored in MongoDB
- [x] Backend deployed on Render (live API URL above)
