import { AppPage } from './app';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class MICPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Switch contexts
    await this.switchToContext();
  }

  async switchToContext() {
    // Get available window handles
    const handles = await browser.getAllWindowHandles();

    // Check that a MIC page was opened
    if (handles.length < 2) {
      throw new Error('It does not appear that a MIC popup window was opened.');
    }

    // Switch context
    await browser.switchTo().window(handles[1]);
  }

  async enterUsername(username) {
    const input = await browser.driver.findElement(by.name('username'));
    return input.sendKeys(username);
  }

  async enterPassword(password) {
    const input = await browser.driver.findElement(by.name('password'));
    return input.sendKeys(password);
  }

  async login(username, password) {
    // Enter username and password
    await this.enterUsername(username);
    await this.enterPassword(password);

    // Click the login button
    const button = await browser.driver.findElement(by.tagName('button'));
    await button.click();

    // Sleep 5 seconds
    await browser.sleep(5000);
  }
}
