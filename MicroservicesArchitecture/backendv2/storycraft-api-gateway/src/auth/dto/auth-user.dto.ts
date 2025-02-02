import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  Email: string;

  @IsString({ message: 'La contraseña debe ser un string' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' }) 
  Password: string;
}