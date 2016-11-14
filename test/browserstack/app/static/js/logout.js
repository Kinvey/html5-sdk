(function(root, $, Kinvey) {
  // Logout
  Kinvey.User.logout()
    .then(function() {
      location.replace('/login.html');
    });
})(window, window.$, window.Kinvey);
