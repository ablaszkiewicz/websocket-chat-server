import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { first } from 'rxjs';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userSerice: UsersService,
  ) {}

  adjectives = ['hungry', 'horny', 'mad', 'smelly', 'lazy', 'fluffy', 'gentle'];
  nouns = [
    'unicorn',
    'wombat',
    'shrimp',
    'penguin',
    'panda',
    'monkey',
    'lion',
    'koala',
    'hippo',
    'frog',
    'dolphin',
    'coyote',
    'cheetah',
    'axolotl',
    'alligator',
  ];

  async validateUser(username: string, password: string): Promise<boolean> {
    return this.userSerice.validate(username, password);
  }

  async login(user: LoginUserDto) {
    const payload = { sub: user.username };

    return {
      username: user.username,
      token: this.jwtService.sign(payload),
    };
  }

  async loginGuest() {
    const username = `${
      this.adjectives[Math.floor(Math.random() * this.adjectives.length)]
    } ${this.nouns[Math.floor(Math.random() * this.nouns.length)]}`;

    const usernameUppercased =
      username.charAt(0).toUpperCase() + username.slice(1);

    const payload = { sub: username };
    return {
      username: usernameUppercased,
      token: this.jwtService.sign(payload),
    };
  }
}
