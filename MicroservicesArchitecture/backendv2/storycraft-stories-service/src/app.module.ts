import { Module } from '@nestjs/common';
import { StoriesModule } from './stories/stories.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), StoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
