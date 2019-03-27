'use strict';

const { OAuth2Client } = require('homey-oauth2app');

module.exports = class AmbiOAuth2Client extends OAuth2Client {

  async getDevices() {
		const result = await this.get({
  		path: `/api/v1/devices`,
    });
    return result.data;
  }

  async off(data) {
    return await this.get({
      path: `/api/v1/device/power/off`,
      json: data,
    });
  }

  async comfort(data) {
    return await this.get({
      path: `/api/v1/device/mode/comfort`,
      json: data,
    });
    return result;
  }

  async appliance_states(data) {
    const result = await this.get({
      path: `/api/v1/device/appliance_states`,
      json: data,
    });
    return result.data;
  }

  async sensor_temperature(data) {
    return await this.get({
      path: `/api/v1/device/sensor/temperature`,
      json: data,
    });
  }

  async sensor_humidity(data) {
    return await this.get({
      path: `/api/v1/device/sensor/humidity`,
      json: data,
    });
  }

}
