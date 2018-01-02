import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  private socket=this.socketService.getSocket();
  private myId=sessionStorage.getItem('clientid');
  private subscribers=new Array();
  constructor(private socketService:SocketService) {
  }

  ngOnInit() {
    this.beingSubscribed();
  }

  subscribe(id){
    console.log("subscribe to "+id.value);
    this.socket.emit('subscribe',{subscriberid:this.myId,subscribeeid:id.value})
  }

  unsubscribe(){

  }

  beingSubscribed(){
    this.socket.on('notifysubscription',function(data){
      console.log(typeof this.subscribers);
      console.log("Subscribed by"+ data.subscriberid);
      this.subscribers.push(data.subscriberid);
    })
  }



}
