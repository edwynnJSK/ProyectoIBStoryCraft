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
  UploadedFile,
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
      return await this.chaptersService.getChapterByID(chapterID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  async addChapter(
    @Body() createChapterDto: CreateChapterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const ImagePath = file
      ? `/images/${file.filename}`
      : '/images/default-chapter-image.jpg';

    try {
      return await this.chaptersService.createChapter({
        ...createChapterDto,
        ImagePath,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('/:chapterId')
  async updateChapter(
    @Param('chapterId') chapterID: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    try {
      const updatedChapter = await this.chaptersService.updateChapterByID(
        chapterID,
        updateChapterDto,
      );
      return updatedChapter;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/:chapterId')
  async deleteChapter(@Param('chapterId') chapterID: string) {
    try {
      return await this.chaptersService.deleteChapterByID(chapterID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/story/:storyId')
  async getChaptersByStory(@Param('storyId') storyID: string) {
    try {
      return await this.chaptersService.getChaptersByStoryId(storyID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
