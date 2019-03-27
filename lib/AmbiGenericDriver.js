'use strict';

const Homey = require('homey');
const { OAuth2Driver } = require('homey-oauth2app');

class AmbiGenericDriver extends OAuth2Driver {

	onOAuth2Init() {

	}

	async onPairListDevices({ oAuth2Client }) {
  	const devices = await oAuth2Client.getDevices();
  	return devices.map(ambi => {
    	return {
      	name: ambi.room_name,
      	data: {
        	id: ambi.device_id,
					location_name : ambi.location_name,
      	}
    	}
  	});
	}
}

module.exports = AmbiGenericDriver;
