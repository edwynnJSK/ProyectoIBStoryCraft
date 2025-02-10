import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { Auth } from './decorators';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() newUser: RegisterUserDto) {
    try {
      return await this.authService.register(newUser);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/login')
  async login(@Body() userInfo: AuthUserDto) {
    try {
      return await this.authService.login(userInfo);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('/update/:userId')
  @Auth()
  async updateUser(
    @Body() userInfo:UpdateUserDto,
    @Param('userId') userId: string,
  ) {
    try {
      return await this.authService.updateUser(userId, userInfo);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
