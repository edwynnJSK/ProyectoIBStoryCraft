import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { ChaptersService } from 'src/chapters/chapters.service';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [StoriesController],
  providers: [StoriesService, ChaptersService]
})
export class StoriesModule {}
