# Ambi Climate

Add wifi support for Ambi Climate v2

Initial release for Ambi Climate v2, supporting only on/off and retrieving current settings for target temperature and temperature sensors.

Please note that, the target temperature and AC mode is currently read only as changing them will cause Ambi Climate to go into Manual mode (no longer on AI Comfort Mode). This is done intentionally.

## How to use
Register a OAuth Client in the Ambi Dev Portal by following the steps on the Quick Start page. You require the Client Id and Client Secret of that client in order to use this app.

## Known Issues/Future release
1. App will timeout during device search if you provide the wrong credentials, Client Id or Client Secret as the underlying API does not throw any error. This will be fixed when the underlying node module is updated
2. Target temperature is currently read only. This is done intentionally as we should be using the comfort mode of the Ambi Climate where the AI sets its own temperature.
3. AC Mode is currently read only. This is done intentionally as we should be using the comfort mode of the Ambi Climate where the AI sets its own mode.
4. On and off will only activate the Comfort Mode or Off Mode.
5. Full information of the AC is available from the API but not displayed to the app. This may be added in the future.
6. Feedback on AI mode to Ambi Climate may be added in the future.

## Flow cards support following triggers
1. Turned on/off
2. Humidity change
3. Target temperature change
4. Sensor temperature change

## Supported Languages
* English   

## Acknowledgement
Thanks to <a href="https://github.com/alisdairjsmyth">alisdairjsmyth</a> for developing the node-ambi-climate.
