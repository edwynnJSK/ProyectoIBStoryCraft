import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs'; 

// Servicio para obtener todos los usuarios
export const getAllUsers = async () => {
  return prisma.users.findMany(); // Acceder a la tabla 'user' a través de 'prisma'
};

// Servicio para crear un nuevo usuario
export const createUser = async (username, email) => {
  return prisma.users.create({
    data: {
      Username: username,
      Email: email,
      Password: "12345"
    },
  });
};

export const updateUserByID = async (userID, data) => {
  try {
    // Filtra solo los campos que tienen valores
    const filteredData = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        filteredData[key] = data[key];
      }
    }

    return prisma.users.update({
      where: { UserID: parseInt(userID, 10) },
      data: filteredData,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user');
  }
};

export const deleteUserByID = async (userID) => {
  try {
    return prisma.users.delete({
      where: { UserID: parseInt(userID, 10) },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting user');
  }
};

export const authenticateUser = async (email, password) => {
  try{
    // Buscar el usuario en la base de datos utilizando Prisma
    const user = await prisma.users.findUnique({
      where: { Email: email, Password:password },  // Busca al usuario por el email
      select: {
        UserID: true,    // Selecciona el campo UserID
        Username: true,  // Selecciona el campo Username
      },
    });
     // Si el usuario no se encuentra, lanza un error
     if (!user) {
      throw new Error('User not found');
    }

    // Validación del password usando bcryptjs
    //const passwordMatch = password == user.Password;  // Compara el password proporcionado con el guardado

    /*if (!passwordMatch) {
      throw new Error('Incorrect password');
    }*/

    // Si las credenciales son correctas, devuelve el usuario (sin el password)
    //const { Password, ...userData } = user;  // Elimina el campo Password de la respuesta

    return user;  // Devuelve el usuario sin el campo Password
  }catch (error){
    console.error(error);
    throw new Error('Error finding user');
  }
}