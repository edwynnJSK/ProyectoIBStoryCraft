import { IsInt, IsString, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateChapterDto {
  @IsInt({ message: 'StoryID debe ser un número entero' })
  StoryID: number;

  @IsString({ message: 'Title debe ser una cadena de texto' })
  @MaxLength(100, { message: 'Title no puede exceder los 100 caracteres' })
  Title: string;

  @IsString({ message: 'Content debe ser una cadena de texto' })
  Content: string;

  @IsInt({ message: 'ChapterNumber debe ser un número entero' })
  @Min(1, { message: 'ChapterNumber debe ser al menos 1' })
  ChapterNumber: number;

  @IsOptional()
  @IsString({ message: 'ImagePath debe ser una cadena de texto' })
  ImagePath?: string | null;
}