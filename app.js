/**
 * Created by vw on 2017-12-15.
 */
const express = require('express');
const path = require('path');
const request=require('request');
const querystring=require('querystring');
const cookieParser=require('cookie-parser');
const http=require('http');
const fs=require('fs');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const cors = require('cors');
//
//
// //Import other folders into the app so they can be used
// const config = require("./config/database");
// const paths = require('./routes/path');
// // const userRoutes=require('./routes/user');
//
// const mongoose = require('mongoose');
//
//
//
//
// //Connect to database
// mongoose.connect(config.database);
//
// //Let us know when the connection is on
// mongoose.connection.on('connected', function(){
//     console.log("Connected to database: " + config.database);
// });
//
// //Check for database connection error
// mongoose.connection.on('error', function(err){
//     console.log("Database connection error: " + err);
// });
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const client_id="990908af7650443799342f406c37de12";
const client_secret="a4486f82c3174d3bb9c66fa4cf910c3d";
var redirect_uri="http://localhost:3000/callback";
var state_key="spotify_auth_state";

//---------------------------------------------------------------
//Creating the express app
const app = express();
const router=express.Router();

// //BodyParser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
//
// //cookieParser middleware
// app.use(cookieParser());
//
// //Set static folder: now the browser will automatically search here for static files such as html pages, image files and
// // css scripts.
app.use(express.static(path.join(__dirname, "/src/")));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});
app.get('/',function(req,res){
  res.sendFile('index.html');
});

router.get('/login',function(req,res){
  var state=generateRandomString(16);
  res.cookie(state_key,state);
  var scope= 'user-read-private user-read-email user-read-recently-played playlist-read-collaborative playlist-modify-public playlist-modify-private ugc-image-upload user-follow-read user-library-read user-read-private user-top-read streaming user-read-currently-playing user-modify-playback-state user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?'+querystring.stringify({
      response_type:'code',
      client_id:client_id,
      scope:scope,
      redirect_uri:redirect_uri,
      state:state
    }));
});

router.get('/callback',function(req,res){
  var code=req.query.code||null;
  var state=req.query.state||null;
  var storedState=req.cookies?req.cookies[state_key]:null;
  if(state===null||state!=storedState){
    res.redirect('/#'+querystring.stringify({
        error:'state_mismatch'
      }));
  }else{
    res.clearCookie(state_key);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions,function(error,response,body){
      if(!error&&response.statusCode===200){
        var access_token=body.access_token,
          refresh_token=body.refresh_token;
        at=access_token;
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      }else{
        res.redirect('/#'+querystring.stringify({error:'invalid_token'}));
      }
    });
  }
});

router.get('/refresh_token',function(req,res){
  var refresh_token=req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.use('/',router);
const port = 3000;

app.listen(process.env.PORT||port,function() {
  console.log('Server started on port ' + port);
});

module.exports=app;
