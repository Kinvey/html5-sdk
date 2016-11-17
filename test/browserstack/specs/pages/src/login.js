import AppPage from './app';

export default class LoginPage extends AppPage {
  get() {
    browser.url('/login.html');
  }

  enterUsername(username) {
    browser.setValue('#username', username);
  }

  enterPassword(password) {
    browser.setValue('#password', password);
  }

  login(username, password) {
    // Enter username and password
    this.enterUsername(username);
    this.enterPassword(password);

    // Submit the login form
    browser.submitForm('#login-form');

    // Wait until the  user is logged in
    browser.waitUntil(
      () => {
        const url = browser.getUrl();
        return url.split(/[?#]/)[0] === `${browser.options.baseUrl}/`
          || url.split(/[?#]/)[0] === `${browser.options.baseUrl}`;
      },
      10000,
      `expected url to be ${browser.options.baseUrl}/`);
  }

  loginWithMIC() {
    browser.click('#loginWithMIC');
  }
}
