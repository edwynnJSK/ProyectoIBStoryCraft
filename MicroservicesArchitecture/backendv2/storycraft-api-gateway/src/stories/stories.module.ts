import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { ImageUploader } from 'src/image-manager.service';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [StoriesController],
  providers: [StoriesService,ImageUploader]
})
export class StoriesModule {}
