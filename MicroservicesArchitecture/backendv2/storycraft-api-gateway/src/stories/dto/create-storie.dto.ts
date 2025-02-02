import { IsString, IsNotEmpty, IsOptional, IsInt, Min} from 'class-validator';

export class CreateStoryDto {
  @IsString({ message: 'Title debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'Title no puede estar vacío' })
  Title: string;

  @IsString({ message: 'Description debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'Description no puede estar vacía' })
  Description: string;

  @IsInt({ message: 'AuthorID debe ser un número entero' })
  @Min(1, { message: 'AuthorID debe ser un número positivo' })
  AuthorID: number;

  @IsOptional()
  @IsString({ message: 'Genre debe ser una cadena de texto' })
  Genre?: string;

  @IsOptional()
  @IsString({ message: 'Status debe ser una cadena de texto' })
  Status?: string;

  @IsOptional()
  @IsString({ message: 'MaturityRating debe ser una cadena de texto' })
  MaturityRating?: string;

  @IsOptional()
  @IsString({ message: 'ImagePath debe ser una cadena de texto' })
  ImagePath?: string;
}