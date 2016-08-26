import { AppPage } from './app';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class LoginPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Go to the login page
    browser.driver.get('http://localhost:3000/login');

    // Switch contexts
    await this.switchToContext();
  }

  async enterUsername(username) {
    const input = await browser.driver.findElement(by.id('username'));
    return input.sendKeys(username);
  }

  async enterPassword(password) {
    const input = await browser.driver.findElement(by.id('password'));
    return input.sendKeys(password);
  }

  async login(username, password) {
    // Enter username and password
    await this.enterUsername(username);
    await this.enterPassword(password);

    // Click the login button
    const button = await browser.driver.findElement(by.id('login'));
    await button.click();

    // Sleep 5 seconds
    await browser.sleep(5000);
  }

  async loginWithMIC() {
    // Click the loginWithMIC button
    const button = await browser.driver.findElement(by.id('loginWithMIC'));
    await button.click();
  }
}
