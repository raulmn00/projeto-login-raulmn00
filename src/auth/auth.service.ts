import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return 'Login service';
  }
  validateUser(email, password) {
    return 'validado';
  }
}
