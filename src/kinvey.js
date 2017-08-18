import { Promise } from 'es6-promise';
import { Kinvey as CoreKinvey, isDefined, KinveyError } from 'kinvey-js-sdk/dist/export';
import { Client } from './client';

export class Kinvey extends CoreKinvey {
  static initialize(config) {
    const client = Kinvey.init(config);
    return Promise.resolve(client.getActiveUser());
  }

  static init(options = {}) {
    if (!isDefined(options.appKey)) {
      throw new KinveyError('No App Key was provided.'
        + ' Unable to create a new Client without an App Key.');
    }

    if (!isDefined(options.appSecret) && !isDefined(options.masterSecret)) {
      throw new KinveyError('No App Secret or Master Secret was provided.'
        + ' Unable to create a new Client without an App Key.');
    }

    return Client.init(options);
  }
}
