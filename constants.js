module.exports = {

	/*
		WEARABLE
	*/

	// Flag for if feathers should be started in verbose mode
	START_FEATHER_IN_VERBOSE_MODE: false,

	// Flag for if feathers should request rssi updates
	REQUEST_RSSI_UPDATES: true,

	// Flag for if feathers should be started in verbose mode
	MINIMUM_RSSI_TO_STAY_CONNECTED: -1000,

	// Override rate at which RSSI should be updated
	OVERRIDE_REQUEST_RSSI_UPDATE_RATE: 1000,



	/*
		EXHIBIT
	*/

	// Peripheral ID of Feathers
	// NOTE: Not sure if this is unique or not per device
	WEARABLE_PERIPHERAL_ID: "f5ca9cca32ee48fdb72ff891e8682203",

	// Readable name for Feathers
	// NOTE: Not sure if this is unique or not per device
	WEARABLE_LOCAL_NAME: "Adafruit Bluefruit LE",

	// Flag for if all discovered peripherals should be logged out
	LOG_ALL_FOUND_DEVICES:  false,

	// Flag for if discovered Feather peripherals should be logged out
	LOG_WEARABLE_DEVICES: false
};