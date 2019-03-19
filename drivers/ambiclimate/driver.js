'use strict';

const Homey = require('homey');
var AmbiClimate = require('node-ambiclimate');
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
