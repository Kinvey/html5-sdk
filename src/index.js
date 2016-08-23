import { Kinvey } from './kinvey';
import { Device } from './device';
import { Popup } from './popup';

// Expose some globals
global.KinveyDevice = Device;
global.KinveyPopup = Popup;

// Export
module.exports = Kinvey;
