import packageJSON from '../package.json';

export class Html5Device {
  static toJSON() {
    const userAgent = global.navigator.userAgent.toLowerCase();
    const rChrome = /(chrome)\/([\w]+)/;
    const rFirefox = /(firefox)\/([\w.]+)/;
    const rIE = /(msie) ([\w.]+)/i;
    const rOpera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
    const rSafari = /(safari)\/([\w.]+)/;
    const rAppleWebkit = /(applewebkit)\/([\w.]+)/;
    const browser = rChrome.exec(userAgent) ||
                    rFirefox.exec(userAgent) ||
                    rIE.exec(userAgent) ||
                    rOpera.exec(userAgent) ||
                    rSafari.exec(userAgent) ||
                    rAppleWebkit.exec(userAgent) ||
                    [];
    return {
      device: {
        model: global.navigator.userAgent
      },
      platform: {
        name: 'html5'
      },
      os: {
        name: browser[1],
        version: browser[2]
      },
      kinveySDK: {
        name: packageJSON.name,
        version: packageJSON.version
      }
    };
  }
}
