import AppPage from './app';

export default class LogoutPage extends AppPage {
  get() {
    browser.url('/logout.html');
  }

  logout() {
    browser.waitUntil(
      () => {
        const url = browser.getUrl();
        if (url) {
          return url.split(/[?#]/)[0] === `${browser.options.baseUrl}/login.html`;
        }
        return false;
      },
      10000,
      `expected url to be ${browser.options.baseUrl}/login.html`);
  }
}
