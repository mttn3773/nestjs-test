import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Пароль должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.',
  })
  readonly password: string;

  @IsString()
  @MaxLength(18)
  readonly nickname: string;
}
