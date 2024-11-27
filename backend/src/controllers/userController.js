import { getAllUsers, createUser, updateUserByID, deleteUserByID,authenticateUser} from '../repositories/userRepositorie.js'

export const getUsers = async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error); 
      res.status(500).json({ error: 'Error fetching users', cause:error });
    }
  };
  
  export const addUser = async (req, res) => {
    const { Username, Email, Password } = req.body;
    try {
      await createUser(Username, Email, Password);
      res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      // Controla errores personalizados
    if (error.message.includes('correo electrónico')) {
      res.status(400).json({ message: "El correo electrónico ya está registrado." });
    } else if (error.message.includes('nombre de usuario')) {
      res.status(400).json({ message: "El nombre de usuario ya está en uso." });
    } else {
      res.status(500).json({ message: "Error al crear el usuario"});
    }
    }
  };


  export const updateUser = async (req, res) => {
    try {
      const { userID } = req.params;
      const { Username, Email, Password } = req.body;
      
      const updatedUser = await updateUserByID(userID, { Username, Email, Password });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating user', cause: error });
    }
  };

  export const deleteUser = async (req, res) => {
    try {
      const { userID } = req.params;
  
      const deletedUser = await deleteUserByID(userID);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting user', cause: error });
    }
  };

  export const authUser = async (req, res) => {
    const { Email, Password } = req.body;
    try {
      const user = await authenticateUser(Email, Password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error authenticating user', cause:error });
    }
  };
