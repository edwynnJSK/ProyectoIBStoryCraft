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
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/users')
  async getUsers() {
    try {
      const users = await this.authService.getUsers();
      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/register')
  async register(@Body() newUser: RegisterUserDto) {
    try {
      await this.authService.register(newUser);
      return { message: 'Usuario creado exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/login')
  async login(@Body() userInfo: AuthUserDto) {
    try {
      console.log("prueba login", userInfo)
      const userData = await this.authService.login(userInfo);
      return userData;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('/update/:userId')
  async updateUser(
    @Body() userInfo: UpdateUserDto,
    @Param('userId') userId: string,
  ) {
    try {
      console.log("prueba update", userInfo, userId)
      await this.authService.updateUser(parseInt(userId), userInfo);
      return { message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      console.log(error)
      throw new HttpException(error.message, error.status);
    }
  }
}
