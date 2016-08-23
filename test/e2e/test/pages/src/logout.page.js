import { AppPage } from './app.page';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class LogoutPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Go to the logout page
    browser.driver.get('http://localhost:3000/pages/logout.html');

    // Switch contexts
    await this.switchToContext();
  }

  async switchToContext() {
    // Get available window handles
    const handles = await browser.getAllWindowHandles();

    // Switch context
    await browser.switchTo().window(handles[0]);
  }
}
