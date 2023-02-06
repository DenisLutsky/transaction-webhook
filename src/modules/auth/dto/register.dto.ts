import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserInput } from 'src/modules/users/interfaces';

export class RegisterDto implements UserInput {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;
}
