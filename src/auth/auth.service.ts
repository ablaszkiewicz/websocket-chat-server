import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    if (username === 'test' && password === 'test') {
      return { username: username, password: password };
    }

    return null;
  }

  async login({ username, password }) {
    const payload = { sub: username };

    return {
      id: 1,
      username: username,
      token: this.jwtService.sign(payload),
    };
  }
}
