import AppPage from './app';

export default class LogoutPage extends AppPage {
  get() {
    browser.url('/logout.html');
  }

  logout() {
    browser.waitUntil(
      () => {
        const url = browser.getUrl();
        return url.split(/[?#]/)[0] === `${browser.options.baseUrl}/login.html`;
      },
      10000,
      `expected url to be ${browser.options.baseUrl}/login.html`);
  }
}
