# Broadcast Server

A real-time message broadcasting server built with Node.js and Socket.IO WebSockets. This project implements a simple chat system where multiple clients can connect and broadcast messages to each other in real-time.

## ✨ Features

- **Real-time Communication**: Bidirectional WebSocket communication using Socket.IO
- **Multi-client Support**: Multiple clients can connect simultaneously
- **Sequential Client IDs**: Clients are assigned friendly IDs (Client#1, Client#2, etc.)
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

> 📢 [Client#1]: Hello everyone!
> Hi there!
> 📢 [Client#1]: Nice to meet you!
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
4. Handles `sendMessage` events from clients
5. Broadcasts messages to all other connected clients (excluding sender)
6. Logs all connections, disconnections, and messages

### Client Side

1. Connects to the server via Socket.IO
2. Sets up an interactive readline interface
3. Sends `sendMessage` events when user types messages
4. Listens for `receiveMessage` events from other clients
5. Displays incoming messages with sender identification

### WebSocket Events

| Event            | Direction       | Description                                |
| ---------------- | --------------- | ------------------------------------------ |
| `connection`     | Server          | New client connected                       |
| `sendMessage`    | Client → Server | Client sends a message                     |
| `receiveMessage` | Server → Client | Server broadcasts message to other clients |
| `disconnect`     | Server          | Client disconnected                        |

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
