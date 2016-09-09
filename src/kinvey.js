import {
  CacheRack,
  NetworkRack,
  CacheMiddleware,
  XHRMiddleware,
  ParseMiddleware,
  SerializeMiddleware
} from './rack';
import { Kinvey, NetworkRequest, CacheRequest } from 'kinvey-javascript-sdk-core';
import { Device } from './device';
import { Popup } from './popup';
import { Promise } from 'es6-promise';

// Set CacheRequest rack
CacheRequest.rack = new CacheRack();

// Set NetworkRequest rack
NetworkRequest.rack = new NetworkRack();

// Add modules
Kinvey.Device = Device;
Kinvey.Popup = Popup;
Kinvey.Promise = Promise;
Kinvey.CacheMiddleware = CacheMiddleware;
Kinvey.HttpMiddleware = XHRMiddleware;
Kinvey.ParseMiddleware = ParseMiddleware;
Kinvey.SerializeMiddleware = SerializeMiddleware;

// Export
export { Kinvey };
