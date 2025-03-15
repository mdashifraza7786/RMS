"use client";

import { useEffect, useState } from "react";

export default function WebSocketClient() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket Server");
      socket.send("Hello Server!");
    };

    socket.onmessage = (event: MessageEvent) => {
      console.log("📩 Message from server:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onerror = (error: Event) => {
      console.error("⚠️ WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from WebSocket Server");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔗 WebSocket Chat</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
