import React, { useState, useRef } from "react";

const App: React.FC = () => {
  const [wsUrl, setWsUrl] = useState<string>(
    "wss://fkmk0rg9vj.execute-api.eu-central-1.amazonaws.com/api/"
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  const log = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const connect = () => {
    if (socketRef.current) {
      log("Already connected!");
      return;
    }

    const socket = new WebSocket(wsUrl);
    console.log("socket ===> ",socket)
    socket.onopen = () => {
      log("Connected to WebSocket");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      log(`Received: ${event.data}`);
    };

    socket.onerror = (error) => {
      log(`WebSocket Error: ${error}`);
    };

    socket.onclose = () => {
      log("Disconnected from WebSocket");
      setIsConnected(false);
      socketRef.current = null;
    };

    socketRef.current = socket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
      log("Disconnected from WebSocket");
    }
  };

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      log("WebSocket is not connected");
      return;
    }

    try {
      socketRef.current.send(message);
      log(`Sent: ${message}`);
      setMessage(""); // Clear input after sending
    } catch (error) {
      log(`Error sending message: ${error}`);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>WebSocket Client</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>
          WebSocket URL:
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            disabled={isConnected}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <div>
        <button
          onClick={connect}
          disabled={isConnected}
          style={{ marginRight: "10px", padding: "10px 20px" }}
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          style={{ marginRight: "10px", padding: "10px 20px" }}
        >
          Disconnect
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Send Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='{"action": "your-action"}'
          style={{ width: "100%", height: "100px", marginBottom: "10px", padding: "5px" }}
        ></textarea>
        <button
          onClick={sendMessage}
          disabled={!isConnected}
          style={{ padding: "10px 20px" }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Logs</h2>
        <div
          style={{
            height: "200px",
            overflowY: "auto",
            color:'rgb(0, 0, 0)',
            border: "1px solid #ccc",
            padding: "10px",
            background: "#f9f9f9",
          }}
        >
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
