import { IsOptional, IsString } from 'class-validator';

export class UpdateStoryDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser un texto válido.' })
  Title?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto válido.' })
  Description?: string;

  @IsOptional()
  @IsString({ message: 'El estado debe ser un texto válido.' })
  Status?: string;

  @IsOptional()
  @IsString({ message: 'El género debe ser un texto válido.' })
  Genre?: string;

  @IsOptional()
  @IsString({ message: 'La clasificación de madurez debe ser un texto válido.' })
  MaturityRating?: string;

  @IsOptional()
  @IsString({ message: 'La ruta de la imagen debe ser un texto válido.' })
  ImagePath?: string;
}