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
  UseInterceptors,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploader } from 'src/image-manager.service';
import { Auth } from 'src/auth/decorators';

@Controller('chapters')
export class ChaptersController {
  constructor(private chaptersService: ChaptersService) {}

  @Get()
  @Auth()
  async getChapters() {
    try {
      return await this.chaptersService.getAllChapters();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:chapterId')
  @Auth()
  async getChapter(@Param('chapterId') chapterID: string) {
    try {
      return await this.chaptersService.getChapterByID(chapterID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/:chapterId/story/:storyId')
  @Auth()
  async getUniqueChapter(@Param('chapterId') chapterID: string, @Param('storyId') storyId: string) {
    try {
      return await this.chaptersService.getUniqueChapter(chapterID, storyId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  @Post()
  @UseInterceptors(
    FileInterceptor('Image', { storage: ImageUploader.getImageUploader() }),
  )
  @Auth()
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
  @UseInterceptors(
    FileInterceptor('Image', { storage: ImageUploader.getImageUploader() }),
  )
  @Auth()
  async updateChapter(
    @Param('chapterId') chapterID: string,
    @Body() updateChapterDto: UpdateChapterDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const existingChapter = await this.chaptersService.getChapterByID(chapterID);
      if (!existingChapter) {
        throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
      }

      let newImagePath = existingChapter.ImagePath;

      if (file) {
        newImagePath = `/images/${file.filename}`;
        ImageUploader.deleteOldImage(existingChapter.ImagePath);
      }
      const updatedChapter = await this.chaptersService.updateChapterByID(
        chapterID,
        {...updateChapterDto, ImagePath: newImagePath},
      );
      return updatedChapter;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/:chapterId')
  @Auth()
  async deleteChapter(@Param('chapterId') chapterID: string) {
    try {
      const existingChapter = await this.chaptersService.getChapterByID(chapterID);
      if (existingChapter) {
        ImageUploader.deleteOldImage(existingChapter.ImagePath);
      }
      return await this.chaptersService.deleteChapterByID(chapterID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/story/:storyId')
  @Auth()
  async getChaptersByStory(@Param('storyId') storyID: string) {
    try {
      return await this.chaptersService.getChaptersByStoryId(storyID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

