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

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/users')
  async getUsers() {
    try {
      return await this.authService.getUsers();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

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
    @Body() userInfo: RegisterUserDto,
    @Param('userId') userId: string,
  ) {
    try {
      return await this.authService.updateUser(userId, userInfo);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
