import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { DoctoravailabilityService } from './doctoravailability.service';
import { CreateDoctoravailabilityDto } from './dto/create-doctoravailability.dto';

@Controller('doctoravailability')
export class DoctoravailabilityController {
  constructor(
    private readonly doctoravailabilityService: DoctoravailabilityService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDoctoravailabilityDto: CreateDoctoravailabilityDto,
  ) {
    const data = await this.doctoravailabilityService.create(
      createDoctoravailabilityDto,
    );
    return {
      success: true,
      data,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('doctorId') doctorId) {
    const data = await this.doctoravailabilityService.findAll(doctorId);
    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const data = await this.doctoravailabilityService.findOne(id);
    return {
      success: true,
      data,
    };
  }
}
