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
 subscribeeId:string;
 subscribers:string[];
 playlistid:string;
 public subscribed:boolean=false;
 public subscribing:boolean=false;


  constructor(private socketService:SocketService, private spotifyService: SpotifyService) {
  }

  ngOnInit() {
    //initialize the local socket
    this.socket=this.socketService.getSocket();
    //check if the subscription state of a user has changed(no one subscribes<=>someone subscribes)
    this.beingSubscribed().subscribe(data=>{
      if(data==true) {
        if (this.subscribed == false) {
          this.subscribed = true;
          this.updateSender(this.createSubscription());
        }
      }
      else if(this.subscribed==true){
        this.subscribed=false;
        this.endSubscription();
      }
    });

  }

  subscribe(id){
    console.log("subscribe to "+id.value);
    this.subscribeeId=id.value;
    this.subscribing=true;
    this.spotifyService.createPlaylist("Listening with "+id.value).subscribe(data=>this.playlistid=data.id);
    this.socket.emit('subscribe',{subscriberid:this.myId,subscribeeid:id.value});
    const receiverObservable=new Observable(observer=>{
      this.socket.on('updateFromSubscribee',function(data){
        console.log('RECEIVED UPDATE FROM SUBSCRIBEE NEW SONG IS '+data.trackname);
        observer.next(data.trackid);
      });
    });
    receiverObservable.subscribe((data)=>{
      let trackids=[];
      trackids.push(data);
      this.spotifyService.addTrackToPlaylist(this.playlistid,trackids);
    });
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
    //check if the track has been changed every 1 second
    const observable=Observable.timer(0,1000);
    return observable.switchMap(event=>this.spotifyService.getCurrentTrack());

  }

  updateSender(subObservable){
    let currentTrack='';
    //subscribe to the observable
    subObservable.subscribe(
      (data)=>{
        //if the track has been changed
        if(data.item.uri!=currentTrack)
        {
          //update current track
          currentTrack=data.item.uri;
          console.log("From updatesender"+data.item.name+data.item.uri);
          //send the new track to the back end
          this.socket.emit('updateTrack',{room:sessionStorage.getItem('clientid'),trackname:data.item.name,trackid:data.item.uri});

        }
      }
    );
  }

  endSubscription(){
    console.log("end subscription");
  }

  getSubscribingStatus(){
    return this.subscribing;
  }

  getSubscribeeId(){
    return this.subscribeeId;
  }





}
