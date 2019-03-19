'use strict';

const Homey = require('homey');

class AmbiClimate extends Homey.App {

	onInit() {
		this.log('Ambiclimate is running...');
	}

}

module.exports = AmbiClimate;
