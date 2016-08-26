(function(root, _, $, Backbone) {
  root.LoginView = Backbone.Layout.extend({
    template: '/login/login.html',
    el: 'main',

    events: {
      'submit #loginForm': 'login',
      'submit #loginWithMICForm': 'loginWithMIC',
    },

    bindings: {
      '#username': 'username',
      '#password': 'password'
    },

    model: root.User,

    login: function(event) {
      event.preventDefault();
      this.model.login();
    },

    loginWithMIC: function(event) {
      event.preventDefault();
      this.model.loginWithMIC();
    }
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
