import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class AppPage {
  async getActiveUser() {
    // Grab value from local storage
    return browser.executeScript(function() {
      try {
        return JSON.parse(this.localStorage.getItem('kid_HkTD2CJckinvey_user'));
      } catch (error) {
        return null;
      }
    });
  }
}
