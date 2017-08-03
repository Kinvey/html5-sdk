import nock from 'nock';
import { Kinvey } from '../../src/kinvey';

// Record for nock
// nock.recorder.rec();

// Init Kinvey
before(function() {
  Kinvey.init({
    appKey: 'kid_HkTD2CJc',
    appSecret: 'cd7f658ed0a548dd8dfadf5a1787568b'
  });
});

// Clear nock
afterEach(function() {
  nock.cleanAll();
});
