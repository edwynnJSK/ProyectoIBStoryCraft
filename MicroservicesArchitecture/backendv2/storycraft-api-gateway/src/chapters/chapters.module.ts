import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService]
})
export class ChaptersModule {}
