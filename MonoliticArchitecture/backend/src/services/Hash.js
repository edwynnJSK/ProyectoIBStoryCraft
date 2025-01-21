import bcrypt from 'bcryptjs'; 

const SALT_HASH = 10

export const hashPassword = async(password) => {
    return await bcrypt.hash(password,SALT_HASH)
}

export const isEqualPassword = async (password, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch; 
    } catch (err) {
      console.log('An error has been produced:', err);
      return false; 
    }
  };