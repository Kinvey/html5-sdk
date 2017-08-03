import { EventEmitter } from 'events';
import { isDefined } from 'kinvey-js-sdk';

export class Popup extends EventEmitter {
  open(url = '/') {
    this.popupWindow = global.open(url, '_blank', 'toolbar=no,location=no');

    if (isDefined(this.popupWindow)) {
      const interval = setInterval(() => {
        if (this.popupWindow.closed) {
          clearInterval(interval);
          this.close();
          this.emit('exit');
        } else {
          try {
            this.emit('urlchange', {
              url: this.popupWindow.location.href
            });
          } catch (e) { }
        }
      }, 100);
    } else {
      throw new Error('The popup was blocked.');
    }

    return this;
  }

  close() {
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupWindow = null;
    }

    return this;
  }
}
