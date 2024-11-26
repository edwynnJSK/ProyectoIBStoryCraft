import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs'; 
import { hashPassword } from '../services/Hash.js';

export const getAllUsers = async () => {
  return prisma.users.findMany();
};

export const createUser = async (username, email, password) => {
   const existingUser = await prisma.users.findFirst({
    where: { Email: email},
  });

  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado.');
  }

  const existingUsername = await prisma.users.findFirst({
    where: { Username: username},
  });

  if (existingUsername) {
    throw new Error('El nombre de usuario ya está en uso.');
  }

  const hashedPassword = await hashPassword(password);
  return prisma.users.create({
    data: {
      Username: username,
      Email: email,
      Password: hashedPassword
    },
  });
};

export const updateUserByID = async (userID, data) => {
  try {
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
    const user = await prisma.users.findUnique({
      where: { Email: email},
      select: {
        UserID: true,    
        Username: true,
        Password: true,  
      },
    });
     if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.Password)
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }
    return {UserID: user.UserID,
            Username: user.Username
    }; 
  }catch (error){
    console.error(error);
    throw new Error('Error finding user');
  }
}