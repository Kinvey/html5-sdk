var expect = require('expect');

describe('User', function() {
  describe('login()', function() {
    it('should not login a user when provided an incorrect username', function() {
      var username = 'tester';
      var password = 'test';

      // Open /login.html
      browser.url('/login.html');

      // Input username and password
      var usernameInput = browser.element('#username');
      usernameInput.setValue(username);
      var passwordInput = browser.element('#password');
      passwordInput.setValue(password);

      // Click the login button
      browser.click('#login');

      // Get the active user
      var notification = browser.element('#notify');
      notification.waitForExist(5000);
      var activeUser = browser.localStorage('GET', 'kid_HkTD2CJckinvey_user').value;
      expect(activeUser).toEqual(null);
    });

    it('should not login a user when provided an incorrect password', function() {
      var username = 'test';
      var password = 'tester';

      // Open /login.html
      browser.url('/login.html');

      // Input username and password
      var usernameInput = browser.element('#username');
      usernameInput.setValue(username);
      var passwordInput = browser.element('#password');
      passwordInput.setValue(password);

      // Click the login button
      browser.click('#login');

      // Get the active user
      var notification = browser.element('#notify');
      notification.waitForExist(5000);
      var activeUser = browser.localStorage('GET', 'kid_HkTD2CJckinvey_user').value;
      expect(activeUser).toEqual(null);
    });

    it('should login a user', function() {
      var username = 'test';
      var password = 'test';

      // Open /login.html
      browser.url('/login.html');

      // Input username and password
      var usernameInput = browser.element('#username');
      usernameInput.setValue(username);
      var passwordInput = browser.element('#password');
      passwordInput.setValue(password);

      // Click the login button
      browser.click('#login');

      // Get the active user
      var notification = browser.element('#notify');
      notification.waitForExist(5000);
      var activeUser = JSON.parse(browser.localStorage('GET', 'kid_HkTD2CJckinvey_user').value);
      expect(activeUser.username).toEqual(username);
      expect(activeUser._kmd).toIncludeKey('authtoken');
    });
  });
});
