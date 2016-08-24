import { AppPage } from './app.page';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class LogoutPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Go to the logout page
    browser.driver.get('http://localhost:3000/logout');

    // Switch contexts
    await this.switchToContext();

    // Grab references to elements on page
    this.logoutButton = await browser.driver.findElement(by.id('logout'));
  }

  logout() {
    return this.logoutButton.click();
  }
}
