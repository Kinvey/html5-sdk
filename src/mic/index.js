import { Promise } from 'es6-promise';
import {
  MobileIdentityConnect as CoreMobileIdentityConnect,
  KinveyError
} from 'kinvey-js-sdk';
import isString from 'lodash/isString';
import url from 'url';
import urljoin from 'url-join';
import { Popup } from './popup';

export class MobileIdentityConnect extends CoreMobileIdentityConnect {
  requestCodeWithPopup(clientId, redirectUri, options = {}) {
    return Promise.resolve()
      .then(() => {
        let pathname = '/oauth/auth';
        const popup = new Popup();

        if (options.version) {
          let version = options.version;

          if (!isString(version)) {
            version = String(version);
          }

          pathname = urljoin(version.indexOf('v') === 0 ? version : `v${version}`, pathname);
        }

        return popup.open(url.format({
          protocol: this.client.micProtocol,
          host: this.client.micHost,
          pathname: pathname,
          query: {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code'
          }
        }));
      })
      .then((popup) => {
        return new Promise((resolve, reject) => {
          let redirected = false;

          function onUrlChange(event) {
            try {
              if (event.url && event.url.indexOf(redirectUri) === 0 && redirected === false) {
                redirected = true;
                popup.close();
                resolve(url.parse(event.url, true).query.code);
              }
            } catch (e) {
              // Just catch the error
            }
          }

          function onExit() {
            if (redirected === false) {
              reject(new KinveyError('Login has been cancelled.'));
            }
          }

          popup.on('urlchange', onUrlChange);
          popup.on('exit', onExit);
        });
      });
  }
}
