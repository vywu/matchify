import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private authed=false;
  private connected=false;
  private socket;
  subscription:Subscription;
  constructor(private socketService: SocketService,private route: ActivatedRoute) { }

  ngOnInit() {
    //Subscribe to the query parameters to get the access and refresh tokens
    this.subscription = this.route.queryParams.subscribe((params: Params) => {
      let accessToken = params['access_token'];
      let refreshToken = params['refresh_token'];
      //If it's first time the parameters are being passed
      if(accessToken!=null&&this.authed==false) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        this.authed=true;
        //Create the socket to the server
        this.createSocketToServer();
        this.socket=this.socketService.getSocket();
        this.socket.on('sendId',function(data){
          this.clientid=data.id;
          localStorage.setItem("clientid",this.clientid);
          console.log("CLIENT ID:"+this.clientid);
        });
      }
    });
  }

  // createSocketToServer(){
  //   var socket=this.socketService.getSocket();
  //   socket=io.connect()
  // }
  createSocketToServer(){
    this.socketService.connect();
  }


}
