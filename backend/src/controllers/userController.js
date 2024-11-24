import { getAllUsers, createUser, updateUserByID, deleteUserByID,authenticateUser} from '../services/userService.js'; // Importar los servicios de usuario

export const getUsers = async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error); // Imprime el error en la consola
      res.status(500).json({ error: 'Error fetching users', cause:error });
    }
  };
  
  export const addUser = async (req, res) => {
    const { Username, Email } = req.body;
    try {
      const newUser = await createUser(Username, Email);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user', cause:error });
    }
  };


  export const updateUser = async (req, res) => {
    try {
      const { userID } = req.params;
      const { Username, Email, Password } = req.body;
  
      // Validar datos requeridos

      /*
      if (!Username && !Email && !Password) {
        return res.status(400).json({ error: 'No data provided to update' });
      }*/
  
      const updatedUser = await updateUserByID(userID, { Username, Email, Password });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
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
