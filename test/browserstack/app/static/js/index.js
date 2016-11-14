(function(root, $, Kinvey) {
  // Initialize Kinvey
  // Replace appKey and appSecret with your apps credentials
  Kinvey.init({
    appKey: 'kid_WJt3WXdOpx',
    appSecret: '7cfd74e7af364c8f90b116c835f92e7d'
  });

  // Get the active user
  Kinvey.User.getActiveUser()
    .then(function(activeUser) {
      // Redirect to /login.html if an active user
      // does not exist
      if (activeUser === null || activeUser === undefined) {
        var authorizedHrefs = [
          '/',
          '/books.html',
          '/index.html',
          '/profile.html',
          '/upload.html'
        ];

        if (authorizedHrefs.indexOf(location.pathname) !== -1) {
          location.replace('/login.html');
        }
      } else {
        // Update the drowdown with the account name
        $('#account-dropdown').html((activeUser.data.firstname || 'User') + ' ' + (activeUser.data.lastname || '') + ' <span class="caret"></span>');
      }
    });
})(window, window.$, window.Kinvey);
