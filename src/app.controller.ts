import { Controller, Get, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,) {}

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/getdata')
  async getLastHit(){
    return this.appService.getLastHits();
  }

  @Get('/getdata/desactivate?')
  async desactivateID(@Query('id') id){
    return this.appService.desactivateById(id);
  }

}
