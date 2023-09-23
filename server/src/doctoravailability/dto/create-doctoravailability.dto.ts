import { IsNotEmpty } from 'class-validator';

export class CreateDoctoravailabilityDto {
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  time: string;

  @IsNotEmpty()
  date: string;
}
