const http = require("http");
const WebSocket = require("ws");

// Create an HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.on("message", (message) => {
    console.log(`📩 Received: ${message}`);

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log(`❌ Client disconnected`);
  });

  ws.on("error", (err) => {
    console.error(`⚠️ WebSocket error:`, err);
  });

  // Send welcome message
  ws.send("👋 Welcome to the WebSocket server!");
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
});
