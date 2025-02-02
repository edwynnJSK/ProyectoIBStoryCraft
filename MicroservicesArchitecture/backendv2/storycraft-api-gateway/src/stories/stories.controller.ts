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

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
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
  async getStory(@Param('storyId') storyID: string) {
    try {
      return await this.storiesService.getStoryByID(storyID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  
  @Post()
  @UseInterceptors(
    FileInterceptor('Image', {storage: ImageUploader.getImageUploader()} ),
  )
  async addStory(
    @Body() storyDto: CreateStoryDto,
    @UploadedFile() file: Express.Multer.File
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
  async updateStory(
    @Param('storyId') storyID: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ) {
    try {
      const updatedStory = await this.storiesService.updateStoryByID(
        storyID,
        updateStoryDto,
      );
      return updatedStory;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/:storyId')
  async deleteStory(@Param('storyId') storyID: string) {
    try {
      return await this.storiesService.deleteStoryByID(storyID);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
