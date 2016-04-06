/**
 * @private
 */
export class PopupAdapter {
  isOpen() {
    return !!this._open;
  }

  open() {
    const promise = new Promise((resolve, reject) => {
      if (this.isOpen()) {
        return reject(new Error('Popup is already open.'));
      }

      this.popup = global.open(this.url, '_blank', 'toolbar=no,location=no');

      if (this.popup) {
        this._open = true;
        const interval = setInterval(() => {
          if (this.popup.closed) {
            this._open = false;
            clearTimeout(interval);
            this.emit('closed');
          } else {
            try {
              this.emit('loaded', this.popup.location.href);
            } catch (e) {
              // catch any errors due to cross domain issues
            }
          }
        }, 100);
      } else {
        return reject(new Error('The popup was blocked.'));
      }

      return resolve(this);
    });

    return promise;
  }

  close() {
    const promise = new Promise(resolve => {
      if (this.popup) {
        this.popup.close();
      }

      resolve();
    });
    return promise;
  }
}
