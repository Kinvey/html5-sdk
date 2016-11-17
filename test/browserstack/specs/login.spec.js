import { LoginPage, LogoutPage } from './pages';
import expect from 'expect';

describe('Login', function() {
  beforeEach(function() {
    const page = new LogoutPage();
    page.get();
    page.logout();
    const activeUser = page.getActiveUser();
    expect(activeUser).toEqual(null);
  });

  it('should login a user using Kinvey', function() {
    const username = 'admin';
    const password = 'admin';
    const page = new LoginPage();
    page.get();
    page.login(username, password);
    const activeUser = page.getActiveUser();
    expect(activeUser).toNotEqual(null);
    expect(activeUser.data.username).toEqual(username);
    expect(activeUser.data._kmd).toIncludeKey('authtoken');
  });

  // it('should login a user using MIC', async function() {
  //   const username = 'test';
  //   const password = 'test';
  //   const loginPage = new LoginPage();

  //   // Open login page
  //   await loginPage.get();

  //   // Login with MIC
  //   await loginPage.loginWithMIC();

  //   // Login
  //   const micPage = new MICPage();
  //   await micPage.get();
  //   await micPage.login(username, password);

  //   // Get the active user
  //   await loginPage.switchToContext();
  //   const activeUser = await loginPage.getActiveUser();

  //   // Check that the active user exists
  //   expect(activeUser).toNotEqual(null);
  //   expect(activeUser.data._kmd).toIncludeKey('authtoken');
  // });
});
