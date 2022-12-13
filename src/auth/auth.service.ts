import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(private readonly userSerivce: UserService) {}
  login() {
    return 'Login service';
  }
  async validateUser(email: string, password: string) {
    const user = await this.userSerivce.findByEmail(email);
    if (user) {
      //verificar se a senha informada corresponde a hash do banco de dados
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }
    //não encontrou um user e/ou senha nao corresponde
    throw new UnauthorizedException(
      'Email address or password is invalid, please try again.',
    );
  }
}
