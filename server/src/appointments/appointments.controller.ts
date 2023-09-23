import {
  Controller,
  Post,
  Get,
  Req,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() body: CreateAppointmentDto) {
    const data = await this.appointmentService.create(request.user.sub, body);
    return {
      success: true,
      data,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() request: Request) {
    const data = await this.appointmentService.findAll(request.user.sub);
    return {
      success: true,
      data,
    };
  }
}
