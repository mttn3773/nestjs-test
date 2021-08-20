import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Пароль должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.',
  })
  public password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  public nickname?: string;
}
