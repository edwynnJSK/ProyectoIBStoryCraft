import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStoryDto } from './dto/create-storie.dto';
import { UpdateStoryDto } from './dto/update-storie.dto';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllStories() {
    try {
      return await this.prisma.stories.findMany();
    } catch (error) {
      throw new Error('Error fetching stories');
    }
  }

  async getStoryByID(storyID: number) {
    try {
      const story = await this.prisma.stories.findUnique({
        where: { StoryID: storyID },
      });
      if (!story) {
        throw new NotFoundException('Story not found');
      }
      return story;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createStory(data: CreateStoryDto) {
    try {
      return await this.prisma.stories.create({
        data: {
          Title: data.Title,
          Description: data.Description || null,
          AuthorID: data.AuthorID,
          Status: data.Status || 'draft',
          Genre: data.Genre || null,
          MaturityRating: data.MaturityRating || null,
          ImagePath: data.ImagePath,
        },
      });
    } catch (error) {
      throw new Error('Error creating story');
    }
  }

  async updateStoryByID(storyID: number, data: UpdateStoryDto) {
    try {
      const story = await this.prisma.stories.findUnique({
        where: { StoryID: storyID },
      });
      if (!story) {
        throw new NotFoundException('Story not found');
      }
      const filteredData: any = {};
      for (const key in data) {
        if (data[key] !== undefined) {
          filteredData[key] = data[key];
        }
      }

      return await this.prisma.stories.update({
        where: { StoryID: storyID },
        data: {
          ...filteredData,
          UpdatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Story with ID ${storyID} not found`);
      }
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteStoryByID(storyId: number) {
    try {
      return await this.prisma.stories.delete({
        where: { StoryID: storyId },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Story with ID ${storyId} not found`);
      }
      throw new HttpException(error.message, error.status);
    }
  }
}
