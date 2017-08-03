import Promise from 'es6-promise';
import {
  User as CoreUser,
  ActiveUserError,
  isDefined
 } from 'kinvey-js-sdk';
import { MobileIdentityConnect } from './mic';

export class User extends CoreUser {
  loginWithMIC(redirectUri, authorizationGrant, options) {
    if (this.isActive()) {
      throw new ActiveUserError('This user is already the active user.');
    }

    if (isDefined(this.client.activeUser)) {
      throw new ActiveUserError('An active user already exists. Please logout the active user before you login.');
    }

    const mic = new MobileIdentityConnect({ client: this.client });
    return mic.login(redirectUri, authorizationGrant, options)
      .then(session => this.connectIdentity(MobileIdentityConnect.identity, session, options));
  }

  static loginWithMIC(redirectUri, authorizationGrant, options) {
    const user = new User({}, options);
    return user.loginWithMIC(redirectUri, authorizationGrant, options);
  }

  disconnectIdentity(identity, options) {
    let promise = Promise.resolve();

    if (identity === MobileIdentityConnect.identity) {
      promise = MobileIdentityConnect.logout(this, options);
    }

    return promise
      .then(() => super.disconnectIdentity(identity, options));
  }
}
