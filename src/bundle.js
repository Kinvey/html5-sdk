import * as CoreKinvey from 'kinvey-js-sdk';
import { User } from './user';
import { Kinvey } from './kinvey';
import { Client } from './client';

// Add all existing namespaces
const keys = Object.keys(CoreKinvey);
keys.forEach((key) => {
  if (key !== 'Kinvey') {
    Kinvey[key] = CoreKinvey[key];
  }
});

// Replace User class
Kinvey.User = User;

// Replace Client class
Kinvey.Client = Client;

// Export
module.exports = Kinvey;
