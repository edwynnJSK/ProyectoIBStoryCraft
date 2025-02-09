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
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-storie.dto';
import { UpdateStoryDto } from './dto/update-storie.dto';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  async getStories() {
    try {
      return await this.storiesService.getAllStories();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:storyId')
  async getStory(@Param('storyId') storyID: string) {
    try {
      const story = await this.storiesService.getStoryByID(parseInt(storyID));
      return story;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  async addStory(@Body() storyDto: CreateStoryDto) {
    try {
      return await this.storiesService.createStory(storyDto);
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
      await this.storiesService.updateStoryByID(
        parseInt(storyID),
        updateStoryDto,
      );
      return { message: 'Historia actualizada exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/:storyId')
  async deleteStory(@Param('storyId') storyID: string) {
    try {
      await this.storiesService.deleteStoryByID(parseInt(storyID));
      return { message: 'Historia eliminada exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
