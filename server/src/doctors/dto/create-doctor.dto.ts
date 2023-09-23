import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @MinLength(1, { message: 'Name must have atleast 1 characters.' })
  @IsNotEmpty()
  name: string;
}
