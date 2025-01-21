import { Module } from '@nestjs/common';
import { ChaptersModule } from './chapters/chapters.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),ChaptersModule],
  controllers: [],
  providers: [ ],
})
export class AppModule {}
