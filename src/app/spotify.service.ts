import { Injectable } from '@angular/core';
import {Http, Headers, Response, URLSearchParams, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class SpotifyService {
  apiUrl="https://api.spotify.com/v1/me";
  token=localStorage.getItem("access_token");
  headers=new Headers({"Authorization":"Bearer "+this.token});

  constructor() { }

}
