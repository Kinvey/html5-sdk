import { EventEmitter } from 'events';

export class Html5Popup extends EventEmitter {
  async open(url = '/') {
    // Open the popup
    this.popup = global.open(url, '_blank', 'toolbar=no,location=no');

    if (this.popup) {
      // Check if the popup is closed or redirect every 100ms
      this.interval = setInterval(() => {
        if (this.popup.closed) {
          this.exitCallback();
        } else {
          try {
            this.loadStopCallback({
              url: this.popup.location.href
            });
          } catch (error) {
            // Just catch the error
          }
        }
      }, 100);
    } else {
      throw new Error('The popup was blocked.');
    }

    return this;
  }

  async close() {
    if (this.popup) {
      this.popup.close();
    }

    return this;
  }

  loadStopCallback(event) {
    this.emit('loadstop', event.url);
  }

  loadErrorCallback(event) {
    this.emit('error', event.message);
  }

  exitCallback() {
    clearInterval(this.interval);
    this.emit('closed');
  }
}
