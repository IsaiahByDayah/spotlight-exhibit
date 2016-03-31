var noble = require('noble');
var _ = require('underscore');

var BLE_MAX_CHUNK_SIZE = 20;

var FEATHER_PERIFERAL_ID = "f5ca9cca32ee48fdb72ff891e8682203";
var FEATHER_LOCAL_NAME = "Adafruit Bluefruit LE";
var UART_SERVICE_UUID = "6e400001b5a3f393e0a9e50e24dcca9e";

var LOG_ALL_FOUND_DEVICES = false;
var LOG_CORRECT_FOUND_DEVICE = true;

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
	noble.startScanning();
  } else {
	noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {

	if (LOG_ALL_FOUND_DEVICES){
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

  	// Arduino Feather
	if ((peripheral.id == FEATHER_PERIFERAL_ID || peripheral.advertisement.localName == FEATHER_LOCAL_NAME) && _.contains(peripheral.advertisement.serviceUuids, UART_SERVICE_UUID)) {

		if (LOG_CORRECT_FOUND_DEVICE){
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

		console.log("Feather Found. Trying to connect...");

		//console.log(peripheral);

		// return;

		peripheral.connect(function(err){

			if (err != null) {
			console.log("\tCould not connect.\n\n");
			console.log(err);
			return;
			}

			console.log("\tConnected!\n\n");

			peripheral.once('disconnect', function(){
				console.log("\n\nPeripheral disconnected.");
			});

			noble.stopScanning();

			// // var rssiCheck = setInterval(function(){
			// 	peripheral.updateRssi(function(err, rssi){

			// 		if (err != null) {
			// 			console.log("Could not get update RSSI...");
			// 			console.log(err);
			// 			return;
			// 		}

			// 		console.log("RSSI: " + rssi);
			// 	});
			// // }, 1000);

			// console.log(peripheral);

			// setInterval(function(){
			// 	console.log(peripheral);
			// }, 5000);

			// console.log(peripheral);

			// peripheral.discoverServices();

			// console.log(peripheral);

			// var serviceUUIDs = [];
			var serviceUUIDs = [UART_SERVICE_UUID];

			if (serviceUUIDs == [UART_SERVICE_UUID])
					console.log("Trying to get UART service...");
				else
					console.log("Trying to get services...");

			peripheral.discoverServices(serviceUUIDs, function(err, services){

				if (err != null || !(services.length > 0)) {
					console.log("\tCould not get service.\n\n");
					console.log(err);
					return;
				}

				console.log("\tServices found ("+services.length+").\n\n");

				// console.log(services);

				_.each(services, function(service){

					if (serviceUUIDs == [UART_SERVICE_UUID])
						console.log("Trying to get UART service characteristics...");
					else
						console.log("Trying to get service characteristics for "+service.uuid+"...");

					service.discoverCharacteristics([], function(err, characteristics){

						if (err != null || !(characteristics.length > 0)) {
							console.log("\tCould not get characteristics for service "+service.uuid+".\n\n");
							// console.log("\t" + err);
							return;
						}

						console.log("\tCharacteristics found ("+characteristics.length+").\n\n");

						// console.log(characteristics);

						_.each(characteristics, function(characteristic){

							// console.log(characteristic);

							if (_.contains(characteristic.properties, "notify")){
								console.log("Setting listener for data notification on characteristic "+characteristic.uuid);
								characteristic.on('read', function(data, isNotification){
									console.log("From read.");
									dataRecieved(characteristic, data, isNotification);
								});

								// characteristic.on('data', function(data, isNotification){
								// 	console.log("From data.");
								// 	dataRecieved(characteristic, data, isNotification);
								// });

								// characteristic.on('notify', function(data, isNotification){
								// 	console.log("From notify.");
								// 	dataRecieved(characteristic, data, isNotification);
								// });

								console.log("Trying to subscribe to characteristic "+characteristic.uuid+"...");
								characteristic.notify(true, function(err){

									if (err != null) {
										console.log("\tError subscribing.\n\n");
										console.log("\t", err);
										return;
									}

									console.log("\tSubscribed.\n\n");
								});
							}

							if (_.contains(characteristic.properties, "write")){
								console.log("Trying to send test message to characteristic "+characteristic.uuid+"...");

								// var count = 0;
								// setInterval(function(){
								// 	var message = new Buffer(count.toString(), "utf-8");
								// 	// var message = new Buffer("I'm a string!", "utf-8");
								// 	// var message = new Buffer("1\n", "utf-8");

								// 	count++;

								// 	characteristic.write(message, false, function(err){

								// 		if (err != null) {
								// 			console.log("\tError sending message.\n\n");
								// 			console.log("\t", err);
								// 			return;
								// 		}

								// 		console.log("\tMessage sent: "+message+"\n\n");
								// 	});
								// }, 5000);

								// var message = new Buffer("This str is 21 chars.", "utf-8");
								var message = new Buffer("This str is 20 chars", "utf-8");
								// var message = new Buffer("012345678901234567890123456789\nSecond Message\n", "utf-8");
								// var message = new Buffer("This is a really long string that is being sent from the pi to the the arduino.\n", "utf-8");
								// var message = new Buffer("Pi -> Arduino", "utf-8");
								// var message = new Buffer("1\n", "utf-8");

								var message2 = new Buffer(". This str is not\n", "utf-8");

								// characteristic.write(message, true, function(err){

								// 	if (err != null) {
								// 		console.log("\tError sending message.\n\n");
								// 		console.log("\t", err);
								// 		return;
								// 	}

								// 	console.log("\tMessage sent: "+message+"\n\n");
								// });

								// characteristic.write(message2, true, function(err){

								// 	if (err != null) {
								// 		console.log("\tError sending message.\n\n");
								// 		console.log("\t", err);
								// 		return;
								// 	}

								// 	console.log("\tMessage sent: "+message2+"\n\n");
								// });

								// var TEST_NUMBER = 3;
								// for (var num = 0; num < TEST_NUMBER; num++) {

								// 	sendMessage(characteristic, i.toString(), function(err){

								// 		if (err) {

								// 		}

								// 		console.log("Message Sent");

								// 	});

								// }

								var longMessage = "0000000000000000000000000~1111111111111111111111111~";
								sendMessage(characteristic, longMessage, function(err){

									if (err) {
										console.log("\tError sending message.\n\n");
										console.log("\t", err);
										return;
									}

									console.log("\tMessage sent: "+longMessage+"\n\n");

								});
							}



							// NOTE: Makes peripheral disconnect for some reason
							/*******************/
							// console.log("Trying to get characteristic " + characteristic.uuid + " discover discriptors...");
							// characteristic.discoverDescriptors(function(err, descriptors){

							// 	if (err != null || !(descriptors.length > 0)) {
							// 		console.log("\tCould not get discriptors for characteristic "+characteristic.uuid+".\n\n");
							// 		// console.log("\t" + err);
							// 		return;
							// 	}

							// 	console.log("\tDiscriptors found for characteristic - " + characteristic.uuid + " ("+descriptors.length+").\n\n");

							// 	console.log(descriptors);
							// });
							/*******************/

						})

					});

				});

			});

			// return;

			// peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics){

			// 	console.log("Services:");

			// 	services.forEach(function(service, index, allServices){
			// 		console.log("\tService #"+index+"\n\t\t"+service+"\n");
			// 	});

			// 	characteristics.forEach(function(characteristic, index, allcharacteristics){
			// 		console.log("\tCharacteristic #"+index+"\n\t\t"+characteristic+"\n");
			// 	});
			// });

		});
  	}
});

function dataRecieved(characteristic, data, isNotification){
	console.log("\nData Recieved:");
	console.log("\tCharacteristic: " + characteristic.uuid);
	console.log("\tNotification: " + isNotification);
	console.log("\tData: " + data + "\n");
}

function sendMessage(characteristic, msg, callback){

	var messages = chunkString(msg, BLE_MAX_CHUNK_SIZE);
	var goalLength = messages.length;

	var sentMessages = {};

	_.each(messages, function(message, index, list){
		(function(msg, i){

			var msgBuffer = new Buffer(msg, "utf-8");
			var key = i.toString();

			sentMessages[key] = {};

			//console.log("SentMessages:", sentMessages);

			characteristic.write(msgBuffer, true, function(err){
				if (err != null) {
					//console.log("\tError sending message.\n\n");
					//console.log("\t", err);

					sentMessages[key].wasSent = true;
					sentMessages[key].hasError = true;
					sentMessages[key].error = err;

					checkStatus(sentMessages, goalLength);

					return;
				}

				//console.log("\tMessage sent: "+i+"\n\n");

				sentMessages[key].wasSent = true;
				sentMessages[key].hasError = false;
				sentMessages[key].error = null;

				checkStatus(sentMessages, goalLength);

				return;
			});
		})(message, index);
	});

	function checkStatus() {

		var numSent = 0;

		var wasError;

		for (prop in sentMessages) {
			if (sentMessages[prop].wasSent) numSent++;

			if (sentMessages[prop].hasError) wasError = sentMessages[prop].error;
		}

		if (numSent == goalLength) {

			callback(wasError);

		}
	}
}

// SOURCE: http://stackoverflow.com/questions/7033639/split-large-string-in-n-size-chunks-in-javascript
function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
