import { IsArray, IsNumber, IsString, MaxLength } from 'class-validator';
export class AddUserTagsDto {
  @IsNumber({}, { each: true })
  readonly tags: number[];
}
