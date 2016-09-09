(function(root, Kinvey) {
  root.LoginView = {
    login: function() {
      // Get username and password
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;

      // Login
      Kinvey.User.login(username, password);

      // Return false to prevent form submission
      return false;
    },

    loginWithMIC: function() {
      // Login with MIC
      Kinvey.User.loginWithMIC('http://localhost:3000');

      // Return false to prevent form submission
      return false;
    }
  };
})(window, window.Kinvey);
