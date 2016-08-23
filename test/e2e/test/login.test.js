import { LoginPage, LogoutPage, MICPage } from './pages';
import expect from 'expect';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

describe('User', function() {
  afterEach(async function() {
    const logoutPage = new LogoutPage();

    // Open logout page
    await logoutPage.get();

    // Sleep 5 seconds
    await browser.sleep(2000);

    // Get the active user
    const activeUser = await logoutPage.getActiveUser();

    // Check that an active user does not exist
    expect(activeUser).toEqual(null);
  });

  describe('login()', function() {
    it('should not login a user when provided an incorrect username', async function() {
      const username = 'tester';
      const password = 'tester';
      const loginPage = new LoginPage();

      // Open login page
      await loginPage.get();

      // Set username and password
      await loginPage.setUsername(username);
      await loginPage.setPassword(password);

      // Login
      await loginPage.login();

      // Sleep 5 seconds
      await browser.sleep(2000);

      // Get the active user
      const activeUser = await loginPage.getActiveUser();

      // Check that an active user does not exist
      expect(activeUser).toEqual(null);
    });

    it('should not login a user when provided an incorrect password', async function() {
      const username = 'test';
      const password = 'tester';
      const loginPage = new LoginPage();

      // Open login page
      await loginPage.get();

      // Set username and password
      await loginPage.setUsername(username);
      await loginPage.setPassword(password);

      // Login
      await loginPage.login();

      // Sleep 5 seconds
      await browser.sleep(2000);

      // Get the active user
      const activeUser = await loginPage.getActiveUser();

      // Check that an active user does not exist
      expect(activeUser).toEqual(null);
    });

    it('should login a user', async function() {
      const username = 'test';
      const password = 'test';
      const loginPage = new LoginPage();

      // Open login page
      await loginPage.get();

      // Set username and password
      await loginPage.setUsername(username);
      await loginPage.setPassword(password);

      // Login
      await loginPage.login();

      // Sleep 5 seconds
      await browser.sleep(2000);

      // Get the active user
      const activeUser = await loginPage.getActiveUser();

      // Check that the active user exists
      expect(activeUser).toNotEqual(null);
      expect(activeUser.username).toEqual(username);
      expect(activeUser._kmd).toIncludeKey('authtoken');
    });
  });

  describe('loginWithMIC()', function() {
    it('should login a user', async function() {
      const username = 'test';
      const password = 'test';
      const loginPage = new LoginPage();

      // Open login page
      await loginPage.get();

      // Login with MIC
      await loginPage.loginWithMIC();

      // Login
      const micPage = new MICPage();
      await micPage.get();
      await micPage.setUsername(username);
      await micPage.setPassword(password);
      await micPage.login();

      // Sleep 5 seconds
      await browser.sleep(2000);

      // Get the active user
      await loginPage.switchToContext();
      const activeUser = await loginPage.getActiveUser();

      // Check that the active user exists
      expect(activeUser).toNotEqual(null);
      expect(activeUser._kmd).toIncludeKey('authtoken');
    });
  });
});
