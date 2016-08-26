import { LoginPage, LogoutPage, MICPage } from './pages';
import expect from 'expect';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

describe('Login', function() {
  afterEach(async function() {
    const page = new LogoutPage();

    // Open logout page
    await page.get();

    // Logout
    await page.logout();

    // Get the active user
    const activeUser = await page.getActiveUser();

    // Check that an active user does not exist
    expect(activeUser).toEqual(null);
  });

  it('should login a user using Kinvey', async function() {
    const username = 'test';
    const password = 'test';
    const page = new LoginPage();

    // Open login page
    await page.get();

    // Login
    await page.login(username, password);

    // Get the active user
    const activeUser = await page.getActiveUser();

    // Check that the active user exists
    expect(activeUser).toNotEqual(null);
    expect(activeUser.username).toEqual(username);
    expect(activeUser._kmd).toIncludeKey('authtoken');
  });

  it('should login a user using MIC', async function() {
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
    await micPage.login(username, password);

    // Get the active user
    await loginPage.switchToContext();
    const activeUser = await loginPage.getActiveUser();

    // Check that the active user exists
    expect(activeUser).toNotEqual(null);
    expect(activeUser._kmd).toIncludeKey('authtoken');
  });
});
