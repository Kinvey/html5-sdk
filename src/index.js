import { Kinvey } from 'kinvey-javascript-sdk-core';
import { NetworkRack } from 'kinvey-javascript-sdk-core/build/rack/rack';
import { SerializeMiddleware } from 'kinvey-javascript-sdk-core/build/rack/middleware/serialize';
import { HttpMiddleware } from './http';

// Add Http middleware
const networkRack = NetworkRack.sharedInstance();
networkRack.useAfter(SerializeMiddleware, new HttpMiddleware());

// Export
module.exports = Kinvey;
