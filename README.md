# Ambi Climate

Add wifi support for Ambi Climate v2

Initial release for Ambi Climate v2, supporting only on/off and retrieving current settings for target temperature and temperature sensors.

Please note that, the target temperature and AC mode is currently read only as changing them will cause Ambi Climate to go into Manual mode (no longer on AI Comfort Mode). This is done intentionally.

## How to use
This app will redirect to Ambi Climate's login page to request for authentication for Homey to control the Ambi Climate device(s).

## Known Issues/Future release
1. Target temperature is currently read only. This is done intentionally as we should be using the comfort mode of the Ambi Climate where the AI sets its own temperature.
2. AC Mode is currently read only. This is done intentionally as we should be using the comfort mode of the Ambi Climate where the AI sets its own mode.
3. On and off will only activate the Comfort Mode or Off Mode.
4. Full information of the AC is available from the API but not displayed to the app. This may be added in the future.
5. Feedback on AI mode to Ambi Climate may be added in the future.
6. Device status and sensors (temperature, humidity) are polled separately to reduced polling traffic and improve performance. The longer the poll the better the response.

## Change Logs

###v0.9.3
* Fixed missing parameters when there are more than 1 Ambi Climate connected to Homey.
* Separated polling for device status and sensors reading (Default 10 seconds and 60 seconds).

###v0.9.2
* Bug fix

###v0.9.1
* Beta release

## Flow cards support following triggers
1. Turned on/off
2. Humidity change
3. Target temperature change
4. Sensor temperature change

## Supported Languages
* English  

## Trademark information
The App creator has no affiliation with Ambi Labs, but is a 3rd party developer. Ambi Climate devices can be found at http://www.ambiclimate.com. Ambi Labs, Ambi Climate, and their respective logos are trademarks of Ambi Labs Ltd.
