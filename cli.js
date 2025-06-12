#!/usr/bin/env node
const { Command } = require("commander");
const { io } = require("socket.io-client");
const readline = require("readline");

// Server dependencies
const http = require("http");
const { Server } = require("socket.io");

const program = new Command();

program.name("broadcast-server").description("CLI for Broadcast Server").version("1.0.0");

// This is server-side code to start the broadcast server
program
  .command("start")
  .description("Start the broadcast server")
  .action(() => {
    require("dotenv").config({ path: "./config.env" });

    const PORT = process.env.PORT || 5001;

    // Create basic HTTP server without express.js
    const httpServer = http.createServer();

    // Initialize Socket.IO server
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // WebSocket connection handling
    let clientCounter = 0;

    // Listen for new client connections
    // which will be triggered from the line
    // `const socket = io(<server_url>)` in the client code
    io.on("connection", (socket) => {
      // Assign sequential client ID (Client#1, Client#2, etc.)
      clientCounter++;
      const clientId = `Client#${clientCounter}`;
      socket.clientId = clientId;

      console.log(`\n[INFO] ${clientId} connected (${socket.id})\n`);

      // Listen for messages from this client
      socket.on("sendMessage", (data) => {
        console.log(`[INFO] Message from ${clientId}: ${data}`);
        // Broadcast message to all other clients (excluding sender)
        // Includes sender ID so receivers know who sent the message
        socket.broadcast.emit("receiveMessage", {
          senderId: clientId,
          message: data,
        });
      });

      socket.on("disconnect", () => {
        console.log(`[INFO] ${clientId} disconnected`);
      });
    });

    // Start the server and log when it's ready
    httpServer.listen(PORT, () => {
      console.log(`[INFO] Broadcast server running on port ${PORT}`);
    });

    // graceful shutdown on Ctrl+C
    process.on("SIGINT", () => {
      console.log("\n[INFO] Shutting down broadcast server...");
      io.close(() => {
        httpServer.close(() => {
          console.log("[INFO] Server closed. Goodbye!");
          process.exit(0);
        });
      });
    });
  });

// This is client-side code to connect to the broadcast server
program
  .command("connect")
  .description("Connect a client to the broadcast server (WebSocket)")
  .action(() => {
    const PORT = process.env.PORT || 5001;
    const socket = io(`http://localhost:${PORT}`);

    // if connected successfully, set up readline for interactive input
    socket.on("connect", () => {
      console.log("✅ Connected to broadcast server!");
      console.log("💬 You can now type messages and press Enter to send them.");
      console.log("🚪 Press Ctrl+C to disconnect.\n");

      // Set up readline for interactive message sending
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
      });

      // Show the prompt using '>'
      rl.prompt();

      // Listen for user input
      rl.on("line", (input) => {
        const message = input.trim();
        // if input exists, send it to the server
        if (message) {
          socket.emit("sendMessage", message);
        }
        rl.prompt();
      });

      rl.on("SIGINT", () => {
        console.log("\n👋 Disconnecting from server...");
        socket.disconnect();
        process.exit(0);
      });
    });

    socket.on("receiveMessage", (data) => {
      // Clear current line and move cursor up to overwrite the prompt
      process.stdout.write("\r\x1b[K");

      // Print the received message with sender ID
      console.log(`📢 [${data.senderId}]: ${data.message}`);

      // Show prompt again if readline is active
      if (socket.connected) {
        process.stdout.write("> ");
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error(`❌ Connection failed: ${error.message}`);
      console.error("Make sure the server is running with 'broadcast-server start'");
      process.exit(1);
    });
  });

program.parse(process.argv);
