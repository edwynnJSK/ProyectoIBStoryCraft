import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}

  async register(data: RegisterUserDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${process.env.AUTH_ENDPOINT}/auth/register`,
          data,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }

  async login(data: AuthUserDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${process.env.AUTH_ENDPOINT}/auth/login`, data),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.statusCode,
      );
    }
  }

  async getUsers() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${process.env.AUTH_ENDPOINT}/auth/users`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error fetching users',
        error.response.data.statusCode,
      );
    }
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(
          `${process.env.AUTH_ENDPOINT}/auth/update/${userId}`,
          data,
        ),
      );
      return response.data;
    } catch (error) {
      throw new NotFoundException(
        'Error updating user',
        error.response.data.statusCode,
      );
    }
  }
}
