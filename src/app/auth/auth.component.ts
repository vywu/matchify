import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { SpotifyService } from '../spotify.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AppInjector} from '../app.injector';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private authed=false;
  private connected=false;
  private socket;
  private userId;

  subscription:Subscription;
  constructor(private socketService: SocketService,private route: ActivatedRoute) { }

  ngOnInit() {
    //Subscribe to the query parameters to get the access and refresh tokens
    this.subscription = this.route.queryParams.subscribe((params: Params) => {
      let accessToken = params['access_token'];
      let refreshToken = params['refresh_token'];

      if((sessionStorage.getItem('accessToken')) && typeof sessionStorage.getItem('accessToken')!='undefined'){this.authed=true;
      console.log("HERE");}
      //If it's first time the parameters are being passed
      if(typeof accessToken != 'undefined' && this.authed == false) {
        console.log("SECOND");
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        this.authed=true;
        const spotifyService = AppInjector.get(SpotifyService);
        spotifyService.getUsername().subscribe(data=>sessionStorage.setItem('username',data.display_name));
        this.userId=sessionStorage.getItem('username');
        //Create the socket to the server
        this.createSocketToServer();
        this.socket=this.socketService.getSocket();
        this.socket.on('sendId',function(data){
          this.clientid=data.id;
          sessionStorage.setItem("clientid",this.clientid);
          console.log("CLIENT ID:"+this.clientid);
        });
      }
    });
    if(sessionStorage.getItem('username'))this.userId=sessionStorage.getItem('username');
  }

  // createSocketToServer(){
  //   var socket=this.socketService.getSocket();
  //   socket=io.connect()
  // }
  createSocketToServer(){
    this.socketService.connect();
  }

  isLoggedIn(){
    return this.authed;
  }

  hasRetrievedName(){
    this.userId=sessionStorage.getItem('username');
    return !(typeof this.userId=='undefined'||this.userId==null);
  }
  greet(){

    return sessionStorage.getItem('clientid')+this.userId;
  }


}
