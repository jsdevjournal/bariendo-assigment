import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entities/appointments.entity';
import { AuthModule } from '../auth/auth.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { DoctoravailabilityModule } from '../doctoravailability/doctoravailability.module';
import { Users } from '../auth/entities/users.entity';
import { Doctors } from '../doctors/entities/doctor.entity';
import { Doctoravailability } from '../doctoravailability/entities/doctoravailability.entity';

@Module({
  imports: [
    AuthModule,
    DoctorsModule,
    DoctoravailabilityModule,
    TypeOrmModule.forFeature([
      Appointments,
      Users,
      Doctors,
      Doctoravailability,
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
