import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from './entities/users.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Users> {
    const { email, password } = registerDto;
    const foundUser = await this._getUserByEmail(email);
    if (foundUser) {
      throw new BadRequestException();
    }

    const user: Users = new Users();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    user.email = email;
    return await this.usersRepository.save(user);
  }

  private async _getUserByEmail(email: string): Promise<Partial<Users> | null> {
    const foundUser = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email })
      .getOne();
    return foundUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const foundUser = await this._getUserByEmail(email);
    if (!foundUser) {
      throw new NotFoundException();
    }
    const pwdMatch = await bcrypt.compare(password, foundUser.password);
    if (!pwdMatch) {
      throw new NotFoundException();
    }
    const payload = { email: foundUser.email, sub: foundUser.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
