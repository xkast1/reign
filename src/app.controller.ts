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
  async getDb(): Promise<string>{
    let retorno;
    const response = await this.etlService.handleCron()
      .then(x=> retorno = x.data.hits);
    console.log(retorno);
    console.log("==================================================================================");
    return JSON.stringify(retorno);
  }
}
