import NodeKinvey from 'kinvey-node-sdk';
import { CacheRack } from './rack';
import Popup from './popup';
import assign from 'lodash/assign';

export default class Kinvey extends NodeKinvey {
  static init(options = {}) {
    options = assign({
      cacheRack: new CacheRack(),
      popupClass: Popup
    }, options);
    return super.init(options);
  }
}
