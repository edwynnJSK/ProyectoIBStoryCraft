import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs'; 

export const getAllUsers = async () => {
  return prisma.users.findMany();
};

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
      where: { Email: email, Password:password },
      select: {
        UserID: true,    
        Username: true,  
      },
    });
     if (!user) {
      throw new Error('User not found');
    }
    return user; 
  }catch (error){
    console.error(error);
    throw new Error('Error finding user');
  }
}