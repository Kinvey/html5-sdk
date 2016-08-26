(function(root, _, $, Backbone) {
  root.LogoutView = Backbone.Layout.extend({
    template: '/logout/logout.html',
    el: 'main',

    events: {
      'submit #logoutForm': 'logout'
    },

    model: root.User,

    logout: function(event) {
      event.preventDefault();
      this.model.logout();
    }
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
