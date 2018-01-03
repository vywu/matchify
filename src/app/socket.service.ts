import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private url = "https://matchify-.herokuapp.com/";
  private socket;
  private clientid;
  constructor() { }

  connect(){
    console.log("CONNECT CALLED.");
    this.socket=io.connect();
    //Get the email from spotify service
    //this.socket.emit('sendEmail',{email:response.email});



  }
  getSocket(){
    return this.socket;
  }
  getClientid(){
    return this.clientid;
  }

  // suscribeToUser(subid){
  //   this.socket.emit("subscribe",{subscriberid:this.clientid,subscribeeid:subid});
  // }

}
