import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChaptersService {
  constructor(private httpService: HttpService) {}

  async getAllChapters() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${process.env.CHAPTERS_ENDPOINT}/chapters`),
      );
      return response.data;
    } catch (error) {
      throw new Error('Error fetching all chapters');
    }
  }

  async getChapterByID(chapterId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${process.env.CHAPTERS_ENDPOINT}/chapters/${chapterId}`,
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

  async createChapter(data: CreateChapterDto) {
    try {
        const response = await lastValueFrom(
            this.httpService.post(
              `${process.env.CHAPTERS_ENDPOINT}/chapters`,
              data,
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

  async updateChapterByID(chapterId: string, data: UpdateChapterDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${process.env.CHAPTERS_ENDPOINT}/chapters/${chapterId}`,
          data,
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

  async deleteChapterByID(chapterId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.delete(
          `${process.env.CHAPTERS_ENDPOINT}/chapters/${chapterId}`,
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
  async getChaptersByStoryId(storyId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${process.env.CHAPTERS_ENDPOINT}/chapters/story/${storyId}`,
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
