var noble = require('noble');
var _ = require('underscore');

var CONSTANTS = require('./constants.js');
var Wearable = require('./wearable.js');

//console.log(wearable);

// console.log(Feather);
// console.log(Feather().isFeather);

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		noble.startScanning();
	} else {
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral) {

	if (CONSTANTS.LOG_ALL_FOUND_DEVICES){
		logPeripheral(peripheral);
	}

  	// Check to see if peripheral is a wearable
  	if (new Wearable().isWearable(peripheral)) {
	// if (Feather.isFeather(peripheral)) {

		if (CONSTANTS.LOG_WEARABLE_DEVICES && !CONSTANTS.LOG_ALL_FOUND_DEVICES){
			logPeripheral(peripheral);
		}

		console.log("Wearable Found...");

		console.log("\tCreating new Wearable object...");
		var wearable = new Wearable(peripheral);

		console.log("\t\tAdding event listeners...");
		wearable.on("ready", function(err){
			console.log("\t\tWearable ready!");
			wearable.sendMessage("This is a really long message. Much more than 20 characters.");
		});

		console.log("\t\tSetting up wearable...");
		wearable.setup();
  	}
});

function logPeripheral(peripheral){
	console.log('peripheral discovered - ' + peripheral.id +
			  ' with address <' + peripheral.address +  ', ' + peripheral.addressType + '>,' +
			  ' connectable ' + peripheral.connectable + ',' +
			  ' RSSI ' + peripheral.rssi + ':');
	console.log('\thello my local name is:');
	console.log('\t\t' + peripheral.advertisement.localName);
	console.log('\tcan I interest you in any of the following advertised services:');
	console.log('\t\t' + JSON.stringify(peripheral.advertisement.serviceUuids));

	var serviceData = peripheral.advertisement.serviceData;
	if (serviceData && serviceData.length) {
		console.log('\there is my service data:');
		for (var i in serviceData) {
			console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
		}
	}
	if (peripheral.advertisement.manufacturerData) {
		console.log('\there is my manufacturer data:');
		console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
	}
	if (peripheral.advertisement.txPowerLevel !== undefined) {
		console.log('\tmy TX power level is:');
		console.log('\t\t' + peripheral.advertisement.txPowerLevel);
	}
}


