import WebSocket from 'ws';

export function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');
    ws.on('message', (message) => {
      console.log('Mensaje recibido:', message);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('error', (err) => console.error('Error en WebSocket:', err));
    ws.on('close', () => console.log('Cliente desconectado'));
  });
}