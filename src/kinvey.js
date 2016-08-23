import { Kinvey as CoreKinvey } from 'kinvey-javascript-sdk-core';
import { NetworkRequest, CacheRequest } from 'kinvey-javascript-sdk-core/dist/request';
import { CacheRack, NetworkRack } from './rack';
import { Promise } from 'es6-promise';

export class Kinvey extends CoreKinvey {
  /**
   * Returns the Promise class.
   *
   * @return {Promise} The Promise class.
   *
   * @example
   * var Promise = Kinvey.Promise;
   */
  static get Promise() {
    return Promise;
  }

  static init(options) {
    const client = super.init(options);

    // Set CacheRequest rack
    CacheRequest.rack = new CacheRack();

    // Set NetworkRequest rack
    NetworkRequest.rack = new NetworkRack();

    return client;
  }
}
