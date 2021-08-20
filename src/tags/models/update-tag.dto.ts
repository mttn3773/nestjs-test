import { IsString, MaxLength } from 'class-validator';
export class UpdateTagDto {
  @IsString()
  @MaxLength(18)
  readonly name: string;

  readonly sortOrder?: number;
}
