import { Kinvey } from 'kinvey-js-sdk/dist/export';
import nock from 'nock';

// Record for nock
// nock.recorder.rec();

function randomString() {
  let string = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i += 1) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return string;
}

// Init Kinvey
before(function() {
  Kinvey.init({
    appKey: randomString(),
    appSecret: randomString()
  });
});

// Clear nock
afterEach(function() {
  nock.cleanAll();
});
