import { Module } from '@nestjs/common';
import { DoctoravailabilityService } from './doctoravailability.service';
import { DoctoravailabilityController } from './doctoravailability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctoravailability } from './entities/doctoravailability.entity';
import { Doctors } from '../doctors/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctoravailability, Doctors])],
  controllers: [DoctoravailabilityController],
  providers: [DoctoravailabilityService],
})
export class DoctoravailabilityModule {}
