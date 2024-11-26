import { Router } from 'express';
import { getUsers, addUser,updateUser, deleteUser,authUser } from '../controllers/userController.js'; // Importar los controladores
import { getStories,addStory, getStory, updateStory, deleteStory, } from '../controllers/storieController.js';
import {getChapter,getChapters,addChapter,updateChapter,deleteChapter } from '../controllers/chapterController.js'

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para crear un nuevo usuario
router.post('/users', addUser);

// Ruta para actualizar un usuario por ID
router.patch('/users/:userID', updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/users/:userID', deleteUser);

//Ruta para autenticar el usuario 
router.post('/users/login', authUser);

//Stories
router.get('/stories', getStories);
router.post('/stories', addStory);
router.get('/stories/:storyID', getStory);
router.patch('/stories/:storyID', updateStory);
router.delete('/stories/:storyID', deleteStory);


//Chapters Pendiente!!!
router.get('/chapters', getChapters);
router.post('/chapters', addChapter)
router.get('/chapters/:chapterID', getChapter);
router.patch('/chapters/:chapterID', updateChapter)
router.delete('/chapters/:chapterID', deleteChapter)

/*
//ReadingLists
router.delete('/readingList/:userID', deleteChapter)*/

export default router; // Exportar las rutas