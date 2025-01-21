import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtEstrategy } from './strategies/jwt.strategy';
import { PasswordService } from './utils/password.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,JwtEstrategy,PasswordService]
})
export class AuthModule {}
