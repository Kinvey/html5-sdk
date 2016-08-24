(function(root, _, $, Backbone) {
  root.LogoutPage = root.Page.extend({
    prefix: '/js/views/pages/logout/',
    template: 'logout.html',

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
