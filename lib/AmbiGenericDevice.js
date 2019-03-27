'use strict';

const Homey = require('homey');
const { OAuth2Device, OAuth2Token, OAuth2Util } = require('homey-oauth2app');
const assert = require('assert');
var room_name = null;
var location_name = null;

class AmbiGenericDevice extends OAuth2Device {

  onOAuth2Migrate() {
    const store = this.getStore();
    if( store.token ) {
      const token = new OAuth2Token(store.token);
      const sessionId = OAuth2Util.getRandomId();
      const configId = this.getDriver().getOAuth2ConfigId();

      return {
        sessionId,
        configId,
        token,
      }

    }
  }

  onOAuth2MigrateSuccess() {
      this.unsetStoreValue('token');
  }

	onOAuth2Init() {
    this.pollDevice(this.getSetting("poll"));

		let settings = {
			 room_name : this.getName(),
			 location_name : this.getData().location_name,
		}

		this.setSettings(settings).then(value => {
			this.room_name = this.getSetting("room_name");
      this.location_name = this.getSetting("location_name");
		});

		this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));


		this.registerCapabilityListener('target_temperature', (value,opts) => {
			// setting temperature will change Ambi Climate to manual temperature mode
			// this.client.temperature({
			//   room_name: this.room_name,
			//   location_name: this.location_name,
			//   value: parseInt(value)
			// }).then(data => {
			//   console.log("Switching to temperature " + JSON.stringify(data));
			// }).catch(err => console.error(err))
			return value;
		})


	}


  async onCapabilityOnoff( value, opts ) {
    if (value){
      return this.oAuth2Client.comfort({
        room_name: this.room_name,
        location_name: this.location_name
      });
    }else{
      return this.oAuth2Client.off({
        room_name: this.room_name,
        location_name: this.location_name
      });
    }
  }

	pollDevice(interval) {
    clearInterval(this.pollingInterval);
    this.pollingInterval = setInterval(() => {

      try {
        this.oAuth2Client.appliance_states({
          room_name: this.room_name,
          location_name: this.location_name,
          limit: 1,
          offset: 0
        }).then(mode => {

          let currentSetting = mode[0];
          this.setCapabilityValue('onoff', currentSetting.power === "On");
          this.setCapabilityValue('target_temperature', parseInt(currentSetting.temperature));
          if (currentSetting.power === "On"){
            this.setCapabilityValue('thermostat_mode', currentSetting.mode.toLowerCase());
          }else{
            this.setCapabilityValue('thermostat_mode', "off");
          }
        }).catch(err => console.error(err))

        this.oAuth2Client.sensor_temperature({
          room_name: this.room_name,
          location_name: this.location_name,
        }).then(reading => {
          let currentReading = reading[0];
          this.setCapabilityValue('measure_temperature', parseFloat(currentReading.value));
        }).catch(err => console.error(err))

        this.oAuth2Client.sensor_humidity({
          room_name: this.room_name,
          location_name: this.location_name,
        }).then(reading => {
          let currentReading = reading[0];
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

	// this method is called when the Device is deleted
	onOAuth2Deleted() {
			this.log('Ambi Climate deleted');
			clearInterval(this.pollingInterval);
	}

	onSettings(oldSettings, newSettings, changedKeys, callback){
			clearInterval(this.pollingInterval);
			this.pollDevice(this.getSetting("poll"));
			callback(null);
	}
}

module.exports = AmbiGenericDevice;
