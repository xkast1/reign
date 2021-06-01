import { Injectable, HttpService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { response } from 'express';
import { promises } from 'fs';

@Injectable()
export class EtlService {

    private urlapi = "https://hn.algolia.com/api/v1/search_by_date?query=nodejs";
    constructor(private httpService: HttpService) {}

    //@Cron(CronExpression.EVERY_HOUR)
    async handleCron(): Promise<any>{
        const value = await this.httpService.get(this.urlapi);
        return new Promise((resolve) => {
            value.subscribe((result) => {
                // aqui lo capturas y lo subes :3 
                resolve(result.data.hits)
            }, error => {
                throw error;
            })
        })
    }
  
}
