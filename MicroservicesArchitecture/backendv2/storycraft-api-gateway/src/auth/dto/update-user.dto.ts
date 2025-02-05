import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser un string' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  Username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  Email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un string' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  Password?: string;
}