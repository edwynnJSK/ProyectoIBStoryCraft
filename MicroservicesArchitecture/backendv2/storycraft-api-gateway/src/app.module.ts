import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StoriesModule } from './stories/stories.module';
import { ChaptersModule } from './chapters/chapters.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { ImageUploader } from './image-manager.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    StoriesModule,
    ChaptersModule,
    ChatModule,
  ],
  controllers: [],
  providers: [ImageUploader],
})
export class AppModule {}
