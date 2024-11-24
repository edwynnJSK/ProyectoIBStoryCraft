import express, { json } from 'express';
import cors from 'cors';
import { config} from 'dotenv';
import userRoutes from './routes/userRoutes.js'; // Importar las rutas de usuarios

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});