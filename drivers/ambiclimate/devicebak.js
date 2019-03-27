'use strict';

const Homey = require('homey');
const Net = require('net');
var AmbiClimate = require('node-ambiclimate');
var client = null;

class AmbiClimateDevice extends Homey.Device {


    // this method is called when the Device is inited
    onInit() {

        if (this.getSetting("clientId")!="" && this.getSetting("clientSecret")!="" && this.getSetting("email")!="" && this.getSetting("password")!=""){
          this.client = new AmbiClimate(this.getSetting("clientId"), this.getSetting("clientSecret"), this.getSetting("email"), this.getSetting("password"));
        }else{
          this.log("Deferring client creation to during device adding");
        }
        this.pollDevice(this.getSetting("poll"));

        // register a capability listener
        this.registerCapabilityListener('onoff', (value,opts) => {
          if (value){
            this.client.comfort({
              room_name: this.getSetting("room_name"),
              location_name: this.getSetting("location_name")
            }).then(data => {
              this.log("Switching to comfort " + JSON.stringify(data));
            }).catch(err => console.error(err))
          }else{
            this.client.off({
              room_name: this.getSetting("room_name"),
              location_name: this.getSetting("location_name")
            }).then(data => {
              this.log("Switching to off " + JSON.stringify(data));
            }).catch(err => console.error(err))
          }
          return value;
        })

        // register a capability listener
        this.registerCapabilityListener('target_temperature', (value,opts) => {

          // setting temperature will change Ambi Climate to manual temperature mode
          // this.client.temperature({
          //   room_name: this.getSetting("room_name"),
          //   location_name: this.getSetting("location_name"),
          //   value: parseInt(value)
          // }).then(data => {
          //   console.log("Switching to temperature " + JSON.stringify(data));
          // }).catch(err => console.error(err))

          return value;
        })

    }

    // this method is called when the Device is added
    onAdded() {
        //this.log('Ambi Climate added with data : ' + JSON.stringify(this.getData()));
        //update settings
        let settings = {
           room_name : this.getName(),
           location_name : this.getData().location_name,
           clientId : this.getData().clientId,
           clientSecret : this.getData().clientSecret,
           email : this.getData().email,
           password : this.getData().password
         }


        this.setSettings(settings).then(value => {
          this.log("Client Id " + this.getSetting("clientId"));
          this.client = new AmbiClimate(this.getSetting("clientId"), this.getSetting("clientSecret"), this.getSetting("email"), this.getSetting("password"));
        });

    }

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('Ambi Climate deleted');
        clearInterval(this.pollingInterval);
    }


    onSettings(oldSettings, newSettings, changedKeys, callback){
        clearInterval(this.pollingInterval);
        this.pollDevice(this.getSetting("poll"));
        callback(null);
    }



  pollDevice(interval) {
    clearInterval(this.pollingInterval);
    this.pollingInterval = setInterval(() => {
        try {
          this.client.appliance_states({
            room_name: this.getSetting("room_name"),
            location_name: this.getSetting("location_name"),
            limit: 1,
            offset: 0
          }).then(mode => {
            let currentSetting = mode.data[0];
            this.log("Current states are " + JSON.stringify(currentSetting));
            this.setCapabilityValue('onoff', currentSetting.power === "On");
            this.setCapabilityValue('target_temperature', parseInt(currentSetting.temperature));
            if (currentSetting.power === "On"){
              this.setCapabilityValue('thermostat_mode', currentSetting.mode.toLowerCase());
            }else{
              this.setCapabilityValue('thermostat_mode', "off");
            }
          }).catch(err => console.error(err))

          this.client.sensor_temperature({
            room_name: this.getSetting("room_name"),
            location_name: this.getSetting("location_name"),
          }).then(reading => {
            let currentReading = reading[0];
            //this.log("Current temperature reading are " + JSON.stringify(currentReading));
            this.setCapabilityValue('measure_temperature', parseFloat(currentReading.value));
          }).catch(err => console.error(err))

          this.client.sensor_humidity({
            room_name: this.getSetting("room_name"),
            location_name: this.getSetting("location_name"),
          }).then(reading => {
            let currentReading = reading[0];
            //this.log("Current humidity reading are " + JSON.stringify(currentReading));
            this.setCapabilityValue('measure_humidity', parseFloat(currentReading.value));
          }).catch(err => console.error(err))

        } catch (error) {
          this.log(error);
          clearInterval(this.pollingInterval);
          setTimeout(() => {
          }, 1000 * interval);
        }
    }, 1000 * interval);
  }



}

module.exports = AmbiClimateDevice;
