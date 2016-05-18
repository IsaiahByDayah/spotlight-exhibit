# spotlight-exhibit

##### Raspberry Pi systems that communicate with [Spotlight Wearables](https://github.com/jordankid93/spotlight-wearable) for tracking user's experiences through a museum

### Description:
A spotlight exhibit is a Node.js application you can run on any compatible device such as a laptop, desktop or microcomputer that will act as an exhibit station in the Spotlight museum experience. Each exhibit can be fine-tuned and tweaked for performance based on the environment of the museum so guest's experiences are just right.

### Pre-requisites:
- OS
  - [Ubuntu Mate 15.10.3+ for Raspberry Pi](https://ubuntu-mate.org/raspberry-pi/)[Tested]
- Hardware
  - Bluetooth Low-Energy Adapter
  - Internet Connection
- Software
  - Node.js


### Libraries used:
- Noble ([Source](https://github.com/sandeepmistry/noble))
- wearable-ble ([Source](https://github.com/jordankid93/wearable-ble))
- Underscore ([Source](http://underscorejs.org))

### Usage:
To get up and running with a Spotlight exhibit, clone this repo on the device you want to use and install the required node modules:
```
git clone https://github.com/jordankid93/spotlight-exhibit.git
cd spotlight-exhibit
npm install
```

Once modules have been installed, edit the config.js file so that the exhibit is making the appropriate calls with the backend.

Once done, simply run the application via npm or node directly
```
npm start // Via npm
node exhibit.js // Node directly
```
