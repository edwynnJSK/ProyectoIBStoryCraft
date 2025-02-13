import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  HttpException,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UpdateStoryDto } from './dto/update-storie.dto';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-storie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploader } from 'src/image-manager.service';
import { ChaptersService } from 'src/chapters/chapters.service';
import { Auth } from 'src/auth/decorators';

@Controller('stories')
export class StoriesController {
  constructor(
    private storiesService: StoriesService,
    private chaptersService: ChaptersService,
  ) {}

  @Get()
  @Auth()
  async getStories() {
    try {
      return await this.storiesService.getAllStories();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:storyId')
  @Auth()
  async getStory(@Param('storyId') storyID: string) {
    try {
      return await this.storiesService.getStoryByID(storyID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('Image', { storage: ImageUploader.getImageUploader() }),
  )
  @Auth()
  async addStory(
    @Body() storyDto: CreateStoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const ImagePath = file
      ? `/images/${file.filename}`
      : '/images/default-story-image.jpg';
    const { AuthorID } = storyDto;
    const authorIDInt = parseInt(AuthorID.toString(), 10);

    try {
      const newStory = await this.storiesService.createStory({
        ...storyDto,
        AuthorID: authorIDInt,
        ImagePath: ImagePath,
      });
      return newStory;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('/:storyId')
  @UseInterceptors(
    FileInterceptor('Image', { storage: ImageUploader.getImageUploader() }),
  )
  @Auth()
  async updateStory(
    @Param('storyId') storyID: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const existingStory = await this.storiesService.getStoryByID(storyID);
      if (!existingStory) {
        throw new HttpException('Story not found', HttpStatus.NOT_FOUND);
      }

      let newImagePath = existingStory.ImagePath;
      if (file) {
        newImagePath = `/images/${file.filename}`;
        ImageUploader.deleteOldImage(existingStory.ImagePath);
      }

      const updatedStory = await this.storiesService.updateStoryByID(storyID, {
        ...updateStoryDto,
        ImagePath: newImagePath,
      });
      return updatedStory;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/:storyId')
  @Auth()
  async deleteStory(@Param('storyId') storyID: string) {
    try {
      const existingStory = await this.storiesService.getStoryByID(storyID);

      let existingChapters = [];
      try {
        existingChapters =
          await this.chaptersService.getChaptersByStoryId(storyID);
      } catch (error) {
        console.log(error)
        if (error.status == 404) {
          existingChapters = [];
        } else {
          throw error;
        }
      }

      if (existingStory) {
        console.log('aca', existingStory);
        ImageUploader.deleteOldImage(existingStory.ImagePath);
      }

      if (existingChapters.length > 0) {
        existingChapters.forEach((chapter) => {
          if (chapter.ImagePath) {
            ImageUploader.deleteOldImage(chapter.ImagePath);
          }
        });
      }

      return await this.storiesService.deleteStoryByID(storyID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
