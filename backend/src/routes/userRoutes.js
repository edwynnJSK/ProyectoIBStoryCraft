import { Router } from 'express';
import { getUsers, addUser,updateUser, deleteUser,authUser } from '../controllers/userController.js'; // Importar los controladores

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para crear un nuevo usuario
router.post('/users', addUser);

// Ruta para actualizar un usuario por ID
router.put('/users/:userID', updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/users/:userID', deleteUser);

//Ruta para autenticar el usuario 
router.post('/users/login', authUser);

export default router; // Exportar las rutas