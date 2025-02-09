import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateStoryDto } from './dto/create-storie.dto';
import { UpdateStoryDto } from './dto/update-storie.dto';

@Injectable()
export class StoriesService {
  constructor(private httpService: HttpService) {}

  async getAllStories() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${process.env.STORIES_ENDPOINT}/stories`),
      );
      return response.data;
    } catch (error) {
      throw new Error('Error fetching stories');
    }
  }

  async getStoryByID(storyId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${process.env.STORIES_ENDPOINT}/stories/${storyId}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }

  async createStory(data: CreateStoryDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${process.env.STORIES_ENDPOINT}/stories`, data),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }

  async updateStoryByID(storyId: string, data: UpdateStoryDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${process.env.STORIES_ENDPOINT}/stories/${storyId}`,
          data
        ),
      );
      
      if (!response.data) {
        throw new Error('No data received from update operation');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating story:', error);
      throw new HttpException(
        error.response?.data?.message || 'Error updating story',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteStoryByID(storyId: string) {
    try {
      try {
        await lastValueFrom(
          this.httpService.delete(
            `${process.env.CHAPTERS_ENDPOINT}/chapters/story/${storyId}`,
          ),
        );
      } catch (error) {
        console.warn(error.response.data.message);
      }

      const response = await lastValueFrom(
        this.httpService.delete(
          `${process.env.STORIES_ENDPOINT}/stories/${storyId}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }
}
