import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { SpotifyService } from '../spotify.service';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
 socket;
 myId: string;
 subscribers:string[];
 public subscribed:boolean=false;
  constructor(private socketService:SocketService, private spotifyService: SpotifyService) {
  }

  ngOnInit() {
    this.socket=this.socketService.getSocket();
    //
    this.beingSubscribed().subscribe(data=>{
      if(data==true) {
        if (this.subscribed == false) {
          this.subscribed = true;
          this.createSubscription();
        }
      }
      else if(this.subscribed==true){
        this.subscribed=false;
        this.endSubscription();
      }
    });
    //this.createSubscription();
  }

  subscribe(id){
    console.log("subscribe to "+id.value);
    this.socket.emit('subscribe',{subscriberid:this.myId,subscribeeid:id.value})
  }

  unsubscribe(){
  }

  beingSubscribed(){
    const socketObservable=new Observable(observer=>{
    this.socket.on('notifysubscription',function(data){
      console.log("Subscribed by"+ data.subscriberid);
      // this.subscribers.push(data.subscriberid);
      //if user is being subscribed for the first time
      // console.log("PRINT FLAG"+this.toSource());
      //console.dir(this);
      observer.next(true);
    });
    }

    );
    return socketObservable;
  }

  createSubscription(){
    var id;
    console.log("CREATE SUB FLAG"+this.subscribed);
    console.log("Create Subs called");
    const observable=Observable.timer(0,1000);
    observable.switchMap(event=>this.spotifyService.getCurrentTrack())
      .subscribe(
      // console.log("SPOTIFY CALLED");
      (data)=>console.log(data)
    );
  }

  endSubscription(){
    console.log("end subscription");
  }





}
