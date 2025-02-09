import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StoriesModule } from './stories/stories.module';
import { ChaptersModule } from './chapters/chapters.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { ImageUploader } from './image-manager.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/log-interceptor.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    StoriesModule,
    ChaptersModule,
    ChatModule,
  ],
  controllers: [],
  providers: [
    ImageUploader,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports:[ImageUploader]
})
export class AppModule {}
