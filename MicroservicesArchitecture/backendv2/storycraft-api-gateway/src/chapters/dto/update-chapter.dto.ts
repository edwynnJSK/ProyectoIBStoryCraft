import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class UpdateChapterDto {
  @IsOptional()
  @IsString({ message: 'Title debe ser una cadena de texto' })
  @MaxLength(100, { message: 'Title no puede exceder los 100 caracteres' })
  Title?: number | null;

  @IsOptional()
  @IsString({ message: 'Content debe ser una cadena de texto' })
  Content?: number | null;

  @IsOptional()
  @IsString({ message: 'ImagePath debe ser una cadena de texto' })
  ImagePath?: number | null;

  @IsOptional()
  @IsInt({ message: 'ChapterNumber debe ser un número entero' })
  @Min(1, { message: 'ChapterNumber debe ser al menos 1' })
  ChapterNumber?: number | null;
}