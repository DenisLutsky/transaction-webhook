import { Body, Controller, Post } from '@nestjs/common';

import { RegisterDto } from '../dto';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async create(@Body() input: RegisterDto): Promise<any> {
    return this.authService.create(input);
  }
}
