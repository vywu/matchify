import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { SocketService } from './socket.service';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { routing } from './app.routes';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule, routing],
  providers: [SpotifyService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
