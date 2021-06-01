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
        // en caso de que quisieras hacer una trasnformacion o algo
        return new Promise((resolve) => {
            value.subscribe((result) => {
                resolve(result.data.hits)
            }, error => {
                throw error;
            })
        })
    }
  
}
