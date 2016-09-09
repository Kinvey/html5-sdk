(function(root, Kinvey) {
  root.LogoutView = {
    logout: function() {
      // Logout
      Kinvey.User.logout();

      // Return false to prevent form submission
      return false;
    }
  };
})(window, window.Kinvey);
