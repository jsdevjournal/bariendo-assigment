import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from './entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctors])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
