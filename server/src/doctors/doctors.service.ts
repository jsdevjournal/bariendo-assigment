import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctors } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctors)
    private readonly doctorRepository: Repository<Doctors>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctors> {
    const data: Doctors = new Doctors();
    data.name = createDoctorDto.name;
    return this.doctorRepository.save(data);
  }

  async findAll(): Promise<Doctors[]> {
    return this.doctorRepository.find();
  }
}
