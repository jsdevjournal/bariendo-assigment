import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  getHello() {
    return this.appService.getHello();
  }
}
