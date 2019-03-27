'use strict';

const Homey = require('homey');
var AmbiClimate = require('node-ambiclimate');
var simpleoauth2 = require("simple-oauth2");
const client = null;

// Section to modify
// var clientId      = "d33247fe-66e1-4c95-a958-d1f30d9434dd";
// var clientSecret  = "0acf632d-68e2-428f-936e-15ec83050a67";
// var email      = "limkopi78@gmail.com";
// var password      = "s7809088z";

var clientId      = "";
var clientSecret  = "";
var email      = "";
var password      = "";

class AmbiClimateDriver extends Homey.Driver {

  onPair(socket){

    let apiUrl = 'https://api.ambiclimate.com/oauth2/authorize?client_id=d33247fe-66e1-4c95-a958-d1f30d9434dd&redirect_uri=https%3A%2F%2Fcallback.athom.com%2Foauth2%2Fcallback%2F&response_type=code';
    let myOAuth2Callback = new Homey.CloudOAuth2Callback(apiUrl)
      myOAuth2Callback
          .on('url', url => {
              // dend the URL to the front-end to open a popup
              console.log("popping up " + url);
              socket.emit('url', url);
          })
          .on('code', code => {
              // ... swap your code here for an access token
              // tell the front-end we're done
              const credentials = {
                client: {
                  id: "d33247fe-66e1-4c95-a958-d1f30d9434dd",
                  secret: "0acf632d-68e2-428f-936e-15ec83050a67"
                },
                auth: {
                  tokenHost: "https://api.ambiclimate.com",
                  tokenPath: "/oauth2/token",
                  authorizePath: "/oauth2/authorize"
                },
                http: {
                  headers: { Accept: "application/json" }
                }
              };

              let oauth2 = simpleoauth2.create(credentials);

              const tokenConfig = {
                code: code,
                redirect_uri: "https://callback.athom.com/oauth2/callback/"
              };

              let token =
              oauth2.authorizationCode.getToken(tokenConfig);

              console.log("almost done with " + code);
              console.log("token done with " + token);
              socket.emit('authorized');
          })
          .generate()
          .catch( err => {
              socket.emit('error', err);
          })

    socket.on('connect', ( data, callback ) => {

      clientId = data.clientId;
      clientSecret = data.clientSecret;
      email = data.email;
      password = data.password;

      try{
        this.client = new AmbiClimate(clientId, clientSecret, email, password);

      }catch(err){
        callback("Invalid Credentials", null);
      }
      callback(null, data);
    });

    socket.on('list_devices', ( data, callback ) => {
      this.listDevices(data, callback);
    });
  }


  listDevices( data, callback ) {
      this.log("List devices with " + JSON.stringify(data));
      let devices = [];

      this.client.devices().then(value => {

          if(!value) {
              this.log('No devices found')
              return
          }
          let ambis = value.data;

          ambis.forEach(ambi => {
            //stores necessary information for amibi library to reconstruct the device in driver.js
            let data = {
              device_id : ambi.device_id,
              location_name : ambi.location_name,
              clientId : clientId,
              clientSecret : clientSecret,
              email : email,
              password : password
            }


            let device = {
                          "name": ambi.room_name,
                          "data": data
                          }
            devices.push(device);
          })

          callback( null, devices );
        }).catch(err => {
          console.error("Error during list devices" + err);
          callback( err, null);
        });
    }
}

module.exports = AmbiClimateDriver;
