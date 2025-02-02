import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from './utils/password.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async register(newUser: RegisterUserDto) {
    try {
      const { Username, Email, Password } = newUser;

      const existingUser = await this.prisma.users.findFirst({
        where: { Email: Email },
      });

      if (existingUser) {
        throw new BadRequestException(
          'El correo electrónico ya está registrado',
        );
      }

      const existingUsername = await this.prisma.users.findFirst({
        where: { Username: Username },
      });

      if (existingUsername) {
        throw new BadRequestException('El nombre de usuario ya está en uso');
      }

      const hashedPassword = await this.passwordService.hashPassword(Password);

      return this.prisma.users.create({
        data: { Username, Email, Password: hashedPassword },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async login(authUserDto: AuthUserDto) {
    try {
      const { Email, Password } = authUserDto;

      const user = await this.prisma.users.findFirst({
        where: { Email: Email },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const isPasswordValid = await this.passwordService.comparePasswords(
        Password,
        user.Password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Credenciales inválidas');
      }

      const payload = { UserId: user.UserID};
      const token = this.jwtService.sign(payload);
      const data = {
        Username: user.Username,
        TokenAuth: token,
      };

      return data;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getUsers() {
    try {
      return this.prisma.users.findMany();
    } catch (error) {
      throw new HttpException('Error al obtener usuarios', error.message);
    }
  }

  async updateUser(userID: number, data: UpdateUserDto) {
    try {
      const filteredData: any = {};

      if (data.Password) {
        const user = await this.prisma.users.findUnique({
          where: { UserID: userID },
        });
        const hasEqualPassword = await this.passwordService.comparePasswords(
          data.Password,
          user.Password,
        );
        if (!hasEqualPassword) {
          data.Password = await this.passwordService.hashPassword(
            data.Password,
          );
        } else {
          data.Password = user.Password;
        }
      }

      for (const key in data) {
        if (data[key] !== undefined) {
          filteredData[key] = data[key];
        }
      }

      return this.prisma.users.update({
        where: { UserID: userID },
        data: filteredData,
      });
    } catch (error) {
      throw new NotFoundException('Error al actualizar usuario', error.message);
    }
  }
}
