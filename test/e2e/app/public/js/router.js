(function(root, _, $, Backbone) {
  root.Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'login': 'login',
      'logout': 'logout',
      'books': 'books'
    },

    home: function() {
      new root.HomeView().render();
    },

    login: function() {
      new root.LoginView().render();
    },

    logout: function() {
      new root.LogoutView().render();
    },

    books: function() {
      new root.BooksView().render();
    }
  });
})(window, window._, window.$, window.Backbone);
