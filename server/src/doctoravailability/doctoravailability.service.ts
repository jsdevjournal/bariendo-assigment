import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctoravailabilityDto } from './dto/create-doctoravailability.dto';
import { Doctoravailability } from './entities/doctoravailability.entity';
import { Doctors } from '../doctors/entities/doctor.entity';

@Injectable()
export class DoctoravailabilityService {
  constructor(
    @InjectRepository(Doctoravailability)
    private readonly doctorAvaiRepository: Repository<Doctoravailability>,
    @InjectRepository(Doctors)
    private readonly doctorsRepository: Repository<Doctors>,
  ) {}

  async create(
    createDoctoravailabilityDto: CreateDoctoravailabilityDto,
  ): Promise<Doctoravailability> {
    const { doctorId, date, time } = createDoctoravailabilityDto;
    const doctor: Doctors = await this.doctorsRepository.findOneBy({
      id: doctorId,
    });
    if (!doctor) {
      throw new NotFoundException();
    }
    const data: Doctoravailability = new Doctoravailability();
    data.doctor = doctor;
    data.date = date;
    data.time = time;
    data.reserved = false;
    return this.doctorAvaiRepository.save(data);
  }

  async findAll(doctorId: string): Promise<Doctoravailability[]> {
    return this.doctorAvaiRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: {
        doctor: true,
      },
    });
  }

  findOne(id: string): Promise<Doctoravailability> {
    return this.doctorAvaiRepository.findOneBy({ id });
  }
}
