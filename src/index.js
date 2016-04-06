import { Kinvey } from 'kinvey-javascript-sdk-core';
import { NetworkRack } from 'kinvey-javascript-sdk-core/build/rack/rack';
import { SerializeMiddleware } from 'kinvey-javascript-sdk-core/build/rack/middleware/serialize';
import { HttpMiddleware } from './http';
import { Device } from 'kinvey-javascript-sdk-core/build/utils/device';
import { DeviceAdapter } from './device';
import { Popup } from 'kinvey-javascript-sdk-core/build/utils/popup';
import { PopupAdapter } from './popup';

// Add Http middleware
const networkRack = NetworkRack.sharedInstance();
networkRack.useAfter(SerializeMiddleware, new HttpMiddleware());

// Use Device Adapter
Device.use(new DeviceAdapter());

// Use Popup Adapter
Popup.use(new PopupAdapter());

// Export
module.exports = Kinvey;
