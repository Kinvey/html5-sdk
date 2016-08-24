(function(root, _, $, Backbone) {
  root.Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'login': 'login',
      'logout': 'logout'
    },

    home: function() {
      new root.HomePage({ el: 'main' }).render();
    },

    login: function() {
      new root.LoginPage({ el: 'main' }).render();
    },

    logout: function() {
      new root.LogoutPage({ el: 'main' }).render();
    }
  });
})(window, window._, window.$, window.Backbone);
