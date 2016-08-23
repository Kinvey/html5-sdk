var user = Kinvey.User.getActiveUser();

if (user) {
  user.logout();
}
