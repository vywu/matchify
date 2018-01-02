import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SpotifyService } from './spotify.service';
import { SocketService } from './socket.service';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import { routing } from './app.routes';
import { Injector } from '@angular/core';
import { setAppInjector } from './app.injector';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SubscribeComponent
  ],
  imports: [
    BrowserModule, routing,HttpModule],
  providers: [SpotifyService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector){
    setAppInjector(injector);
  }
}
