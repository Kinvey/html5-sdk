import { Kinvey } from 'kinvey-javascript-sdk-core';
import { NetworkRequest, CacheRequest } from 'kinvey-javascript-sdk-core/dist/request';
import {
  CacheRack,
  NetworkRack,
  CacheMiddleware,
  HttpMiddleware,
  ParseMiddleware,
  SerializeMiddleware
} from './rack';
import { Promise } from 'es6-promise';

// Set CacheRequest rack
CacheRequest.rack = new CacheRack();

// Set NetworkRequest rack
NetworkRequest.rack = new NetworkRack();

// Add modules
Kinvey.Promise = Promise;
Kinvey.CacheMiddleware = CacheMiddleware;
Kinvey.HttpMiddleware = HttpMiddleware;
Kinvey.ParseMiddleware = ParseMiddleware;
Kinvey.SerializeMiddleware = SerializeMiddleware;

// Export
export { Kinvey };
