'use strict';

const Homey = require('homey');
const { OAuth2App } = require('homey-oauth2app');
const AmbiOAuth2Client = require('./lib/AmbiOAuth2Client');

class AmbiApp extends OAuth2App {

	onOAuth2Init() {

  	this.enableOAuth2Debug();
  	this.setOAuth2Config({
    	client: AmbiOAuth2Client,
    	apiUrl: 'https://api.ambiclimate.com',
    	tokenUrl: 'https://api.ambiclimate.com/oauth2/token',
    	authorizationUrl: 'https://api.ambiclimate.com/oauth2/authorize',
    	scopes: [ 'email', 'device_read', 'ac_control' ]
  	});

	}

}

module.exports = AmbiApp;
