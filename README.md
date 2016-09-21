# Kinvey HTML5 SDK [![Build Status](https://travis-ci.org/Kinvey/html5-sdk.svg?branch=master)](https://travis-ci.org/Kinvey/html5-sdk) [![Code Climate](https://codeclimate.com/github/Kinvey/html5-sdk/badges/gpa.svg)](https://codeclimate.com/github/Kinvey/html5-sdk) [![codecov](https://codecov.io/gh/Kinvey/html5-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/Kinvey/html5-sdk)

[Kinvey](http://www.kinvey.com) (pronounced Kin-vey, like convey) makes it ridiculously easy for developers to setup, use and operate a cloud backend for their mobile apps. They don't have to worry about connecting to various cloud services, setting up servers for their backend, or maintaining and scaling them.

This node and bower module makes it very easy to connect your Html5 app with Kinvey.

## How to use

#### 1. Sign up for Kinvey
To use the SDK, sign up for Kinvey if you have not already done so. Go to the [sign up](https://console.kinvey.com/#signup) page, and follow the steps provided.

#### 2. Install the SDK
You can install the module using npm:

```bash
npm install kinvey-html5-sdk --save
```

or

```bash
bower install kinvey-html5-sdk --save
```

#### 3. Configure the SDK
If you installed the SDK with npm, import the sdk in your code using `require`.

```javascript
var Kinvey = require('kinvey-html5-sdk');
```

If you installed the SDK with bower, add a script tag to your main html file.

```html
<script src="bower_components/kinvey-html5-sdk/dist/kinvey-html5-sdk.min.js"></script>
```

Next, use `Kinvey.init` to configure your app. Replace `<appKey>` and `<appSecret>` with your apps app key and secret. You can find these for your app using the [Kinvey Console App](https://console.kinvey.com).

```javascript
Kinvey.init({
    appKey: '<appKey>',
    appSecret: '<appSecret>'
});
```

#### 4. Verify Set Up
You can use the following snippet to verify the app credentials were entered correctly. This function will contact the backend and verify that the SDK can communicate with your app.

```javascript
Kinvey.ping().then(function(response) {
  console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
}).catch(function(error) {
  console.log('Kinvey Ping Failed. Response: ' + error.message);
});
```

## What’s next?
You are now ready to start building your awesome apps! Next we recommend diving into the [User guide](http://devcenter.kinvey.com/html5-v3.0/guides/users) or [Data store guide](http://devcenter.kinvey.com/html5-v3.0/guides/datastore) to learn more about our service, or explore the [sample apps](http://devcenter.kinvey.com/html5-v3.0/samples) to go straight to working projects.

## Tasks
_Note: Before running any tasks you will need to run `npm install` to install any dependencies required._

* `npm run clean`: remove files created by the build process
* `npm run lint`: lint the src files
* `npm run build`: build the sdk
* `npm run bundle`: bundle the sdk for dist

## Test
_Note: Before running any tests you will need to run `npm install` to install any dependencies required._

### Unit Tests
The steps for running the unit tests is as follows:

1. Open a terminal window and execute `npm test`.

### End to End Tests
The steps for running the end to end tests is as follows:

#### Start Selenium Web Server
1. Open a terminal window.
2. Change directory to the location of the project.
3. Execute `npm run e2e:server`. __Keep this terminal window open.__

#### Start App
1. Open a terminal window.
2. Change directory to the location of the project.
3. Execute `npm run e2e:app`. __Keep this terminal window open.__

#### Run End to End Tests
1. Open a terminal window.
2. Change directory to the location of the project.
3. Execute `npm run e2e:test`.

