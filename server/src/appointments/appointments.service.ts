import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointments } from './entities/appointments.entity';
import { Users } from '../auth/entities/users.entity';
import { Doctors } from '../doctors/entities/doctor.entity';
import { Doctoravailability } from '../doctoravailability/entities/doctoravailability.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private readonly appointmentsRepository: Repository<Appointments>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Doctors)
    private readonly doctorsRepository: Repository<Doctors>,
    @InjectRepository(Doctoravailability)
    private readonly doctorAvaiRepository: Repository<Doctoravailability>,
  ) { }

  async create(
    userId: string,
    createNoteDto: CreateAppointmentDto,
  ): Promise<Appointments[]> {
    const { doctoravailabilityIds } = createNoteDto;
    if (!Array.isArray(doctoravailabilityIds)) {
      throw new BadRequestException();
    }
    const foundUser = await this.usersRepository.findOneBy({ id: userId });
    if (!foundUser) {
      throw new NotFoundException();
    }

    // Retrieve doctoravailabilities and related doctor information in a single query
    const doctorAvailabilities = await this.doctorAvaiRepository.find({
      where: {
        id: In(doctoravailabilityIds),
        reserved: false
      },
      relations: ['doctor'],
    });

    const appointmentsPromises = doctorAvailabilities.map(async (doctoravailability) => {

      doctoravailability.reserved = true;

      const data: Appointments = new Appointments();
      data.user = foundUser;
      data.doctor = doctoravailability.doctor;
      data.date = doctoravailability.date;
      data.time = doctoravailability.time;

      await Promise.all([
        this.doctorAvaiRepository.save(doctoravailability),
        this.appointmentsRepository.save(data),
      ]);

      return data;
    });

    return Promise.all(appointmentsPromises);
  }

  async findAll(userId: string): Promise<Appointments[]> {
    return this.appointmentsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        doctor: true,
      },
    });
  }
}
