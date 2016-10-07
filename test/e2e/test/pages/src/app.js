import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class AppPage {
  async getActiveUser() {
    // Grab value from local storage
    return browser.executeAsyncScript(function() {
      const callback = arguments[arguments.length - 1];
      Kinvey.User.getActiveUser()
        .then(user => callback(JSON.stringify(user)));
    }).then(user => JSON.parse(user));
  }

  async switchToContext() {
    // Get available window handles
    const handles = await browser.getAllWindowHandles();

    // Switch context
    await browser.switchTo().window(handles[0]);
  }
}
