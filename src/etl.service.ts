import { Injectable, HttpService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MongoClient } from 'mongodb';

@Injectable()
export class EtlService {

    private urlapi = "https://hn.algolia.com/api/v1/search_by_date?query=nodejs";
    private mongouri = "mongodb+srv://prueba:Nm2245697@cluster0.jeesn.mongodb.net/reign?retryWrites=true&w=majority";
    private client: MongoClient;

    constructor(private httpService: HttpService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron(): Promise<any>{
        this.conection();
        await this.client.connect();
        await this.httpService.get(this.urlapi).toPromise()
        .then(async x => {
            let responseApi = x.data.hits;
            let dataInsert;
            await this.obteinDuplicateData(responseApi).then((y) => {
                dataInsert = y;
            });
            let cleanData;
            if(dataInsert == '' || dataInsert === undefined){
                cleanData = responseApi;
            }else{
                cleanData = this.preventDuplicate(responseApi, dataInsert);
            }
            if(cleanData.length === 0){
                return;
            }
            this.client
            .db("reign")
            .collection('hits') 
            .insertMany(cleanData, (error, res) => {
                if (error) throw error;
              });       
        });      
    }

    private async obteinDuplicateData(listHits : any[]){
        this.conection();
        await this.client.connect();
        const objectsIds = listHits.map((v)=> v.objectID);
        return new Promise((resolve) => {
            this.client
              .db('reign')
              .collection('hits')
              .find({ objectID: { $in: objectsIds } })
              .toArray((error, result) => {
                if (error) throw error;
                resolve(result);
              });
          }); 
    }

    private preventDuplicate(newHits: any[], sameHits: any[]){
        const cleanHits = [];
        for(let idxHits = 0; idxHits<newHits.length; idxHits++){
            let isSame = false;
            for(let idxSameHits = 0; idxSameHits<sameHits.length; idxSameHits++){
                if(newHits[idxHits].objectID === sameHits[idxSameHits].objectID){
                    isSame=true;
                }
            }
            console.log(isSame);
            if(!isSame){
                cleanHits.push(newHits[idxHits]);
            }   
        }
        return cleanHits;
    }

    private conection() {
        this.client = new MongoClient(this.mongouri,{ useUnifiedTopology: true });
    }
}
