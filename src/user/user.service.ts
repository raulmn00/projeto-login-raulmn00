import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (user) throw new UnauthorizedException(['User already exists']);

    const createdUser = await this.prisma.user.create({ data });
    delete createdUser.password;
    return {
      ...createdUser,
    };
  }

  async findByEmail(email: string) {
    const userFound = await this.prisma.user.findUnique({ where: { email } });
    return userFound;
  }
}
