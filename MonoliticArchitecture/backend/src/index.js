import express, { json } from 'express';
import cors from 'cors';
import { config} from 'dotenv';
import userRoutes from './routes/userRoutes.js'; 
import { setupWebSocket } from './websocket.js';
import { fileURLToPath } from 'url';
import path from 'path';

config();

const app = express();

app.use(cors()); 
app.use(json()); 

// Rutas de la API
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is working!');
});

//Configuracion de directorio imagenes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesPath = path.join(__dirname, 'images');
app.use('/images', express.static(imagesPath));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});;

setupWebSocket(server)
