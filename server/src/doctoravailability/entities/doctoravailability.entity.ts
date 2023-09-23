import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Doctors } from '../../doctors/entities/doctor.entity';

@Entity({ name: 'doctoravailability' })
export class Doctoravailability {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctors)
  @JoinColumn()
  doctor: Doctors;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  reserved: boolean;
}
