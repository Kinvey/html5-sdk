import Kinvey from 'kinvey-javascript-sdk-core';
import { NetworkRack } from 'kinvey-javascript-sdk-core/es5/rack/rack';
import { HttpMiddleware } from 'kinvey-javascript-sdk-core/es5/rack/middleware/http';
import { Html5HttpMiddleware } from './http';
import { Html5Device } from './device';
import { Html5Popup } from './popup';

// Add Http middleware
const networkRack = NetworkRack.sharedInstance();
networkRack.swap(HttpMiddleware, new Html5HttpMiddleware());

// Expose some globals
global.KinveyDevice = Html5Device;
global.KinveyPopup = Html5Popup;

// Export
module.exports = Kinvey;
