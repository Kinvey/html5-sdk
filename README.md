# Kinvey Html5 SDK
[Kinvey](http://www.kinvey.com) (pronounced Kin-vey, like convey) makes it ridiculously easy for developers to setup, use and operate a cloud backend for their mobile apps. They don't have to worry about connecting to various cloud services, setting up servers for their backend, or maintaining and scaling them.

This node and bower module makes it very easy to connect your Html5 app with Kinvey.

## Building
The simplest way to build the sdk is by running `gulp`. More advanced tasks are available.

* `gulp clean`: remove files created by the build process
* `gulp lint`: lint the src files
* `gulp bump`: bump the pacakge version
* `gulp build`: build the sdk
* `gulp bundle`: bundle the sdk for dist
* `gulp upload`: upload dist files to AWS S3

### Flags
The following flags are available when running `gulp bump`:

* `--type <major|minor|patch|prerelease>`: Bumps the package version using the [Semantic Version 2.0.0](http://semver.org/) spec. Defaults to `patch`.
* `--version <version>`: Sets the package version to the provided version.

## Testing

You can run the tests using `npm test`.

## Releasing
The workflow for releasing a new version of the sdk is as follows:

1. Commit all changes on the develop branch.
2. Checkout the master branch and merge the develop branch.
3. Update the [Changelog](CHANGELOG.md).
4. Run `gulp bump --type <type>` replacing `<type>` with major, minor, patch, or prerelease. See [Flags](#Flags) above.
5. Run `gulp release`.
6. Make sure all changes are committed on the master branch and push.
7. Checkout the develop branch and merge the master branch.
8. __Optional:__ Update Dev Center and Sample apps.

## How to use

### 1. Sign up for Kinvey
To use the library, sign up for Kinvey if you have not already done so. Go to the [sign up](https://console.kinvey.com/#signup) page, and follow the steps provided.

### 2. Install the library
You can install the module using npm:

```bash
npm install kinvey-html5-sdk --save
```

or

```bash
bower install kinvey-html5-sdk --save
```

### 3. Configure the library
Now, the library is available for use in your project.

If you installed the library with npm, import the library in your code using `require`.

```javascript
var Kinvey = require('kinvey-html5-sdk');
```

If you installed the library with bower, add a script tag to your main html file.

```html
<script src="bower_components/kinvey-html5-sdk/dist/kinvey-html5-sdk.min.js"></script>
```

Next, use `Kinvey.init` to configure your app:

```javascript
Kinvey.init({
    appKey: '<appKey>',
    appSecret: '<appSecret>'
});
```

### 4. Verify Set Up
You can use the following snippet to verify the app credentials were entered correctly. This function will contact the backend and verify that the library can communicate with your app.

```javascript
Kinvey.ping().then(function(response) {
  console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
}).catch(function(error) {
  console.log('Kinvey Ping Failed. Response: ' + error.description);
});
```

## What’s next?
You are now ready to start building your awesome apps! Next we recommend diving into the [User guide](http://devcenter.kinvey.com/html5-v3.0/guides/users) or [Data store guide](http://devcenter.kinvey.com/html5-v3.0/guides/datastore) to learn more about our service, or explore the [sample apps](http://devcenter.kinvey.com/html5-v3.0/samples) to go straight to working projects.

## License

    Copyright 2016 Kinvey, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
