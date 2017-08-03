import { Promise } from 'es6-promise';
import {
  Kinvey as CoreKinvey,
  KinveyError,
  isDefined
} from 'kinvey-js-sdk';
import { Client } from './client';

export class Kinvey extends CoreKinvey {
  static init(config = {}) {
    if (isDefined(config.appKey) === false) {
      throw new KinveyError('No App Key was provided.'
        + ' Unable to initialize the SDK without an App Key.');
    }

    if (isDefined(config.appSecret) === false) {
      throw new KinveyError('No App Secret was provided.'
        + ' Unable to initialize the SDK without an App Secret.');
    }

    return Client.init(config);
  }

  static initialize(config) {
    const client = Kinvey.init(config);
    return Promise.resolve(client.getActiveUser());
  }
}
