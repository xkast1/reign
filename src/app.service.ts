import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class AppService {

  private mongouri = "mongodb+srv://prueba:Nm2245697@cluster0.jeesn.mongodb.net/reign?retryWrites=true&w=majority";
  private client;

  getHello(): string {
    return 'Hello World!';
  }

  async getLastHits(): Promise<String>{
    this.conection();
    await this.client.connect();
    return new Promise((resolve) =>{
      this.client
        .db('reign')
        .collection('hits')
        .find({deactivate: { $exists: false }})
        .sort({ created_at_i: -1 })
        .toArray((error, result) => {
          if (error) throw error;
            resolve(result);
          });
    });
  }

  async desactivateById(id: string){
    this.conection();
    await this.client.connect();
    return new Promise((resolve) =>{
      this.client
        .db('reign')
        .collection('hits')
        .updateOne({objectID: id}, { $set: { deactivate: true } }, (error, res) => {
          if(error) throw error;
          resolve(res);
        });
    });
  }

  private conection() {
      this.client = new MongoClient(this.mongouri,{ useUnifiedTopology: true });
  }
}
