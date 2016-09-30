import NodeKinvey from 'kinvey-node-sdk';
import { CacheRack } from './rack';
import { Popup } from './utils';

export default class Kinvey extends NodeKinvey {
  static init(options = {}) {
    options.cacheRack = options.cacheRack || new CacheRack();
    options.popupClass = Popup;
    return super.init(options);
  }
}
