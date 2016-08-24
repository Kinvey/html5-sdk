(function(root, _, $, Backbone) {
  root.LoginPage = root.Page.extend({
    prefix: '/js/views/pages/login/',
    template: 'login.html',

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
