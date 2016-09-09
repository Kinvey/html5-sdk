import { AppPage } from './app';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class BooksPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Go to the login page
    browser.driver.get('http://localhost:3000/books');

    // Switch contexts
    await this.switchToContext();
  }

  async pull() {
    // Click pull button
    const button = await browser.driver.findElement(by.id('pull'));
    await button.click();

    // Sleep for 5 seconds
    await browser.sleep(5000);
  }
}
