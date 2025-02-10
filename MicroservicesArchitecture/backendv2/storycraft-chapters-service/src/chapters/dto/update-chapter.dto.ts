import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class UpdateChapterDto {
  @IsOptional()
  @IsString({ message: 'Title debe ser una cadena de texto' })
  @MaxLength(100, { message: 'Title no puede exceder los 100 caracteres' })
  Title?: string;

  @IsOptional()
  @IsString({ message: 'Content debe ser una cadena de texto' })
  Content?: string;

  @IsOptional()
  @IsString({ message: 'ImagePath debe ser una cadena de texto' })
  ImagePath?: string;

  @IsOptional()
  @IsString({ message: 'ChapterNumber debe ser un número entero' })
  ChapterNumber?: string;
}