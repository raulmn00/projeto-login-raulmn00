import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/userPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/userToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSerivce: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    //Transforma o user em JWT
    const payLoad: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtToken = this.jwtService.sign(payLoad, {
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: jwtToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userSerivce.findByEmail(email);
    if (user) {
      //verificar se a senha informada corresponde a hash do banco de dados
      const isPasswordValid = await bcrypt.compare(password, user.password);
      delete user.password;
      if (isPasswordValid) {
        return {
          ...user,
        };
      }
    }
    //não encontrou um user e/ou senha nao corresponde
    throw new UnauthorizedException(
      'Email address or password is invalid, please try again.',
    );
  }
}
