import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { ImageUploader } from 'src/image-manager.service';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [ChaptersController],
  providers: [ChaptersService,ImageUploader],
})
export class ChaptersModule {}
