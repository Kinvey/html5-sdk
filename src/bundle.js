import CoreKinvey from 'kinvey-js-sdk/dist/bundle';
import { User } from './user';
import { Kinvey } from './kinvey';

// Add all existing namespaces
const keys = Object.keys(CoreKinvey);
keys.forEach((key) => {
  Kinvey[key] = CoreKinvey[key];
});

// Replace User Class
Kinvey.User = User;

// Export
module.exports = Kinvey;
