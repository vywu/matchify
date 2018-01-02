import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Injectable()
export class SpotifyService {

  constructor(private http:Http) { }
  apiUrl="https://api.spotify.com/v1/me";
  token=sessionStorage.getItem("accessToken");

  headers=new Headers({"Authorization":"Bearer "+this.token});
  userId:string="";
  getUsername(){
    console.log(this.token);
    var username:string;
    return this.http.get(this.apiUrl,{headers:this.headers}).map((response:Response)=>response.json());
  }

  getRecentTracks(){
    return this.http.get(this.apiUrl+'/player/recently-played',{headers:this.headers}).map((response:Response)=>response.json())
  }

  getCurrentTrack(){
    return this.http.get(this.apiUrl+'/player/currently-playing',{headers:this.headers}).map((response:Response)=>response.json());
  }

  pauseCurrentTrack(){
    return this.http.put(this.apiUrl+'/player/pause',null,{headers:this.headers}).map((response:Response)=>response.json());
  }

  startCurrentTrack(){

    return this.http.put(this.apiUrl+'/player/play',null,{headers:this.headers}).map((response:Response)=>response.json());
  }

  skipCurrentTrack(){
    return this.http.post(this.apiUrl+'/player/next',null,{headers:this.headers}).map((response:Response)=>response.json()).subscribe(data=>console.log(data));
  }

  previousTrack() {
    return this.http.post(this.apiUrl + '/player/previous', null, {headers: this.headers}).map((response: Response) => response.json()).subscribe(data =>{});
  }

  getPlayback(){
    return this.http.get(this.apiUrl+'/player',{headers:this.headers}).map((response:Response)=>response.json());
  }

  getSavedTracksInit(){
    let params=new URLSearchParams();
    params.append("limit","50");
    params.append("offset","0");
    let options=new RequestOptions({headers:this.headers,params:params});
    return this.http.get(this.apiUrl+'/tracks',options).map((response:Response)=>response.json());
  }

  getSavedTracks(url:string){
    let params=new URLSearchParams();
    return this.http.get(url,{headers:this.headers}).map((response:Response)=>response.json());
  }

  createPlaylist(name:string){
    this.headers.append("Content-Type","application/json");

    const body={name:name};
    return this.http.post("https://api.spotify.com/v1/users/"+this.userId+"/playlists",body,{headers:this.headers}).map((response:Response)=>response.json());
  }

  addTrackToPlaylist(id:any,tracks:string[]){
    this.headers.append("Content-Type","application/json");
    const body={uris:tracks};
    this.http.post("https://api.spotify.com/v1/users/"+this.userId+"/playlists/"+id+"/tracks",body,{headers:this.headers}).map((response:Response)=>response.json()).subscribe(data=>console.log(data));
  }

  getUserId(){
    return this.http.get(this.apiUrl,{headers:this.headers}).map((response:Response)=>response.json()).subscribe(data=>{this.userId=data.id;});
  }


}


