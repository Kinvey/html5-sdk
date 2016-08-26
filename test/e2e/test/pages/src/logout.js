import { AppPage } from './app';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class LogoutPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Go to the logout page
    browser.driver.get('http://localhost:3000/logout');

    // Switch contexts
    await this.switchToContext();
  }

  async logout() {
    // Click the logout button
    const button = await browser.driver.findElement(by.id('logout'));
    await button.click();

    // Sleep 5 seconds
    await browser.sleep(2000);
  }
}
