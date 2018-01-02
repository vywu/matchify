import { Component,OnInit,Input, Directive } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  private socketService: SocketService;
  title = 'app';

  ngOnInit(){
    console.log("app recreated");
  }
  isConnected(){
    if((sessionStorage.getItem('clientid')) && typeof sessionStorage.getItem('clientid')!='undefined')
      return true;
    return false;
  }
}
