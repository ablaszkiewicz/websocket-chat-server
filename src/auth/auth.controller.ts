import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() body): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('auth/guest')
  async loginGuest(): Promise<any> {
    return this.authService.loginGuest();
  }
}
