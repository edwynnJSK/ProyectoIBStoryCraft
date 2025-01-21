import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('chapters')
export class ChaptersController {
  constructor(private chaptersService: ChaptersService) {}

  @Get()
  async getChapters() {
    try {
      return await this.chaptersService.getAllChapters();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:chapterId')
  async getChapter(@Param('chapterId') chapterID: string) {
    try {
      const chapter = await this.chaptersService.getChapterByID(
        parseInt(chapterID),
      );
      return chapter;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  async addChapter(@Body() createChapterDto: CreateChapterDto) {
    try {
      await this.chaptersService.createChapter(createChapterDto);
      return { message: 'Capítulo creado exitosamente' };
    } catch (error) {
      throw new HttpException(
        { error: 'Error creating chapter', cause: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/:chapterId')
  async updateChapter(
    @Param('chapterId') chapterID: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    try {
      await this.chaptersService.updateChapterByID(
        parseInt(chapterID),
        updateChapterDto,
      );
      return { message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/:chapterId')
  async deleteChapter(@Param('chapterId') chapterID: string) {
    try {
      await this.chaptersService.deleteChapterByID(parseInt(chapterID));
      return { message: 'Capítulo eliminado exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/story/:storyId')
  async getChaptersByStory(@Param('storyId') storyID: string) {
    try {
      return await this.chaptersService.getChaptersByStoryId(parseInt(storyID));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
