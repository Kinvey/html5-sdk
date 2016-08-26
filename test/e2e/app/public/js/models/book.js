(function(root, _, $, Backbone, Kinvey) {
  root.Book = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/Books'
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
