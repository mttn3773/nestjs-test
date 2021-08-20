import { IsString, MaxLength } from 'class-validator';
export class CreateTagDto {
  @IsString()
  @MaxLength(18)
  readonly name: string;

  readonly sortOrder?: number;
}
