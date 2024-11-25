import { WebSocketServer } from 'ws'; 
import WebSocket from 'ws';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server })

  wss.on("connection", (ws) => {
    console.log("Nuevo cliente conectado");
    ws.on("message", (message) => {
      console.log("Mensaje recibido:", message);
      const messageData = JSON.parse(message);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(messageData));
        }
      });
    });

    ws.on("error", (err) => {
      console.error("Error en WebSocket:", err);
    });

    ws.on("close", () => {
      console.log("Cliente desconectado");
    });
  });
}
