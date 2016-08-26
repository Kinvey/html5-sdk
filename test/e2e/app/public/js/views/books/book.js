(function(root, _) {
  root.BookView = Backbone.Layout.extend({
    template: 'books/book.html',
    tagName: 'tr',
    className: 'book',

    serialize: function() {
      return { book: _.clone(this.model.attributes) };
    }
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
