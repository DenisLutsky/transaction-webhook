import { Body, Controller, Post } from '@nestjs/common';

import { RegisterDto } from '../dto';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() input: RegisterDto): Promise<string> {
    return await this.authService.register(input);
  }

  @Post('sign-in')
  public async signIn(@Body() input: RegisterDto): Promise<string> {
    return await this.authService.login(input);
  }
}
