import { BooksPage, LoginPage, LogoutPage } from './pages';
import expect from 'expect';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

describe('Books', function() {
  beforeEach(async function() {
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
  });

  afterEach(async function() {
    const page = new LogoutPage();

    // Open logout page
    await page.get();

    // Login
    await page.logout();

    // Get the active user
    const activeUser = await page.getActiveUser();

    // Check that an active user does not exist
    expect(activeUser).toEqual(null);
  });

  it('should not have data in the table', async function() {
    const page = new BooksPage();

    // Open logout page
    await page.get();

    // Expectations
    const books = await browser.driver.findElements(by.className('book'));
    expect(books.length).toEqual(0);
  });

  it('should have 2 books in the table after a pull', async function() {
    const page = new BooksPage();

    // Open logout page
    await page.get();

    // Pull
    await page.pull();

    // Expectations
    const books = await browser.driver.findElements(by.className('book'));
    expect(books.length).toEqual(2);
  });
});
