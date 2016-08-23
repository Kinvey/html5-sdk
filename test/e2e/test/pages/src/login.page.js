import { AppPage } from './app.page';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class LoginPage extends AppPage {
  async get() {
    browser.ignoreSynchronization = true;

    // Go to the login page
    browser.driver.get('http://localhost:3000/pages/login.html');

    // Switch contexts
    await this.switchToContext();

    // Grab references to elements on page
    this.usernameInput = await browser.driver.findElement(by.id('username'));
    this.passwordInput = await browser.driver.findElement(by.id('password'));
    this.loginButton = await browser.driver.findElement(by.id('login'));
    this.loginWithMICButton = await browser.driver.findElement(by.id('loginWithMIC'));
  }

  async switchToContext() {
    // Get available window handles
    const handles = await browser.getAllWindowHandles();

    // Switch context
    await browser.switchTo().window(handles[0]);
  }

  setUsername(username) {
    return this.usernameInput.sendKeys(username);
  }

  setPassword(password) {
    return this.passwordInput.sendKeys(password);
  }

  login() {
    return this.loginButton.click();
  }

  loginWithMIC() {
    return this.loginWithMICButton.click();
  }
}
