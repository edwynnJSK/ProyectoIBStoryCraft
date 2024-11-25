import express, { json } from 'express';
import cors from 'cors';
import { config} from 'dotenv';
import userRoutes from './routes/userRoutes.js'; // Importar las rutas de usuarios
import { WebSocketServer } from 'ws'; // Importar WebSocketServer de la librería ws
import WebSocket from 'ws';

// Cargar las variables de entorno
config();

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(cors()); // Habilitar CORS
app.use(json()); // Parsear JSON en el cuerpo de las peticiones

// Rutas de la API
app.use('/api', userRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Backend API is working!');
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});;

// Crear servidor WebSocket
const wss = new WebSocketServer({ server });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');

  
  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);

    const messageData = JSON.parse(message);
    // Envío a todos los clientes conectados menos al remitente
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageData));
      }
    });
  });
  // Manejador de errores de WebSockets
  ws.on('error', (err) => {
    console.error('Error en WebSocket:', err);
  });
  // Notificación de desconexión
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});