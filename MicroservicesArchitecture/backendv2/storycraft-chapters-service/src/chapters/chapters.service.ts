import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {

  constructor(private prisma: PrismaService) {}

  async getAllChapters() {
    try {
      return await this.prisma.chapters.findMany();
    } catch (error) {
      throw new Error('Error fetching all chapters');
    }
  }

  async getChapterByID(chapterID: number) {
    try {
      const chapter = await this.prisma.chapters.findUnique({
        where: { ChapterID: chapterID },
      });
      if (!chapter) {
        throw new NotFoundException(`Chapter not found`);
      }
      return chapter;
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async getUniqueChapter(chapterId: number, storyId: number) {
    try {
      const chapter = await this.prisma.chapters.findFirst({
        where: {
          ChapterID: chapterId,
          StoryID: storyId
        },
      });
      if (!chapter) {
        throw new NotFoundException(`Chapter not found`);
      }
      return chapter;
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async createChapter(data: CreateChapterDto) {
    try {
      return await this.prisma.chapters.create({
        data: {
          StoryID: data.StoryID,
          Title: data.Title,
          Content: data.Content,
          ChapterNumber: data.ChapterNumber,
          ImagePath: data.ImagePath,
        },
      });
    } catch (error) {
      throw new Error('Error creating chapter');
    }
  }

  async updateChapterByID(chapterID: number, data: UpdateChapterDto) {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      );

     await this.prisma.chapters.update({
        where: { ChapterID: chapterID },
        data: filteredData,
      });

    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Chapter with ID ${chapterID} not found`);
      }
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteChapterByID(chapterID: number) {
    try {
      await this.prisma.chapters.delete({
        where: { ChapterID: chapterID },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Chapter with ID ${chapterID} not found`);
      }
      throw new HttpException(error.message, error.status);
    }
  }
  async getChaptersByStoryId(storyID: number) {
    try {
      const chapters = await this.prisma.chapters.findMany({
        where: { StoryID: storyID },
      });
      
      if (!chapters || chapters.length == 0) {
        throw new NotFoundException(`Chapters for story ID ${storyID} not found`);
      }
      return chapters;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

