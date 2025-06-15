# Broadcast Server

A real-time message broadcasting server built with Node.js and Socket.IO WebSockets. This project implements a simple chat system where multiple clients can connect and broadcast messages to each other in real-time.

## ✨ Features

- **Real-time Communication**: Bidirectional WebSocket communication using Socket.IO
- **Multi-client Support**: Multiple clients can connect simultaneously
- **Sequential Client IDs**: Clients are assigned friendly IDs (Client#1, Client#2, etc.)
- **Message History**: New clients receive all previous messages when they connect
- **Interactive CLI**: Type and send messages directly from the terminal
- **Clean Architecture**: Single-file implementation for simplicity
- **Graceful Shutdown**: Proper server cleanup on Ctrl+C
- **No Message Echo**: Clients don't see their own messages

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Start the Server

```bash
npx broadcast-server start
```

The server will start on port 5001 (or the port specified in your `config.env` file).

### Connect Clients

Open additional terminal windows and connect clients:

```bash
npx broadcast-server connect
```

Start typing messages and press Enter to broadcast them to all other connected clients!

## 📖 Usage

### Commands

| Command                        | Description                            |
| ------------------------------ | -------------------------------------- |
| `npx broadcast-server start`   | Start the broadcast server             |
| `npx broadcast-server connect` | Connect as a client and start chatting |

### Interactive Client

Once connected, you can:

- Type messages and press Enter to send them
- See messages from other clients with their sender IDs
- View message history from previous conversations when you first connect
- Press Ctrl+C to disconnect gracefully

### Example Session

**Terminal 1 (Server):**

```bash
$ npx broadcast-server start
[INFO] Broadcast server running on port 5001

[INFO] Client#1 connected (xYz123...)

[INFO] Client#2 connected (aBc456...)
[INFO] Message from Client#1: Hello everyone!
[INFO] Message from Client#2: Hi there!
```

**Terminal 2 (Client#1):**

```bash
$ npx broadcast-server connect
✅ Connected to broadcast server!
💬 You can now type messages and press Enter to send them.
🚪 Press Ctrl+C to disconnect.

> Hello everyone!
> 📢 [Client#2]: Hi there!
> Nice to meet you!
```

**Terminal 3 (Client#2):**

```bash
$ npx broadcast-server connect
✅ Connected to broadcast server!
💬 You can now type messages and press Enter to send them.
🚪 Press Ctrl+C to disconnect.

📜 Message History:
📢 [Client#1]: Hello everyone!

> 📢 [Client#1]: Hello everyone!
> Hi there!
> 📢 [Client#1]: Nice to meet you!
```

### Message History Example

When a new client connects after others have already been chatting:

**Terminal 4 (Client#3 - joining later):**

```bash
$ npx broadcast-server connect
✅ Connected to broadcast server!
💬 You can now type messages and press Enter to send them.
🚪 Press Ctrl+C to disconnect.

📜 Message History:
📢 [Client#1]: Hello everyone!
📢 [Client#2]: Hi there!
📢 [Client#1]: Nice to meet you!

> Just joined the conversation!
```

## 🏗️ Architecture

```
broadcast_server/
├── cli.js         # Complete server and client implementation
├── package.json   # Dependencies and project configuration
├── config.env     # Environment variables (PORT=5001)
└── README.md      # This file
```

### Technology Stack

- **Node.js**: Runtime environment
- **Socket.IO**: WebSocket library for real-time communication
- **Commander.js**: CLI framework
- **Readline**: Interactive terminal input

## ⚙️ Configuration

### Environment Variables

Create or modify `config.env`:

```env
PORT=5001
```

## 🔧 How It Works

### Server Side

1. Creates an HTTP server and attaches Socket.IO
2. Listens for client connections on the specified port
3. Assigns sequential client IDs (Client#1, Client#2, etc.)
4. Maintains a message history array with sender info and timestamps
5. Sends complete message history to newly connected clients
6. Handles `sendMessage` events from clients
7. Stores all messages in history for future clients
8. Broadcasts messages to all other connected clients (excluding sender)
9. Logs all connections, disconnections, and messages

### Client Side

1. Connects to the server via Socket.IO
2. Receives and displays message history upon connection
3. Sets up an interactive readline interface
4. Sends `sendMessage` events when user types messages
5. Listens for `receiveMessage` events from other clients
6. Displays incoming messages with sender identification

### WebSocket Events

| Event            | Direction       | Description                                |
| ---------------- | --------------- | ------------------------------------------ |
| `connection`     | Server          | New client connected                       |
| `sendMessage`    | Client → Server | Client sends a message                     |
| `receiveMessage` | Server → Client | Server broadcasts message to other clients |
| `messageHistory` | Server → Client | Server sends message history to new client |
| `disconnect`     | Server          | Client disconnected                        |

### Message History Implementation

The server maintains an in-memory array that stores all messages with the following structure:

```javascript
{
  senderId: "Client#1",
  message: "Hello everyone!",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

**Features:**

- **Automatic Delivery**: New clients automatically receive complete message history upon connection
- **Persistent Storage**: Messages persist in server memory until server restart
- **Chronological Order**: Messages are delivered in the order they were sent
- **Sender Identification**: Each message includes the original sender's client ID
- **Timestamp Support**: Messages include ISO timestamp for future features

**Behavior:**

- New clients see the `📜 Message History:` header followed by all previous messages
- If no messages exist, clients proceed directly to the interactive prompt
- Message history is delivered before the client becomes interactive

## 🛠️ Development

### Project Structure

The entire application is contained in a single `cli.js` file that handles both:

- Server functionality (when using `start` command)
- Client functionality (when using `connect` command)

This design keeps the project simple while demonstrating the core concepts of WebSocket communication.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with multiple clients
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning and development purposes.

---

**Built with ❤️ for learning WebSocket communication and real-time applications.**
