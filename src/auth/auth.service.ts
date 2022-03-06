import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  users = [
    {
      username: 'Olucha',
      password: '123',
    },
    {
      username: 'Matejuk',
      password: '123',
    },
  ];

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.filter(
      (userTmp) => userTmp.username === username,
    )[0] as any;
    if (user.password == password) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = { sub: user.username };

    return {
      username: user.username,
      token: this.jwtService.sign(payload),
    };
  }
}
