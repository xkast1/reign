import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EtlService } from './etl.service';
import { promises } from 'fs';
import { async } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
    private etlService: EtlService) {}

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/db')
  async getDb(){
    return await this.etlService.handleCron();
  }
}
