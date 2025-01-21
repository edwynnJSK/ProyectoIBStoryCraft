import bcrypt from "bcryptjs";
import { isEqualPassword, hashPassword } from "./services/Hash.js";

const password = "12345";
const hashedPassword = await hashPassword(password);
console.log(hashedPassword);

isEqualPassword(password, hashedPassword)
  .then((isMatch) => console.log(isMatch)) // true o false
  .catch((err) => console.error(err));
