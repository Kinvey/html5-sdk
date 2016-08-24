(function(root, _, $, Backbone, Kinvey) {
  var User = Backbone.Model.extend({
    login: function() {
      var attributes = this.attributes;
      return Kinvey.User.login(attributes.username, attributes.password);
    },

    loginWithMIC: function() {
      return Kinvey.User.loginWithMIC('http://localhost:3000');
    },

    logout: function() {
      return Kinvey.User.logout();
    }
  });

  // Create a singleton of the User model
  root.User = new User();
})(window, window._, window.$, window.Backbone, window.Kinvey);
