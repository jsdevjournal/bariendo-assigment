import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Doctors } from '../../doctors/entities/doctor.entity';
import { Users } from '../../auth/entities/users.entity';

@Entity({ name: 'appointments' })
export class Appointments {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Doctors)
  @JoinColumn()
  doctor: Doctors;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'date' })
  date: string;
}
