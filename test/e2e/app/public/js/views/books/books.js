(function(root, _, $, Backbone) {
  root.BooksView = Backbone.Layout.extend({
    template: '/books/books.html',
    el: 'main',
    collection: new root.Books(),

    events: {
      'click #refresh': 'refresh',
      'click #pull': 'pull',
      'click #add': 'add',
      'click #clear': 'clear'
    },

    initialize: function() {
      this.listenTo(this.collection, 'add', this.addView);
      this.listenTo(this.collection, 'reset', this.removeViews);
      this.refresh();
    },

    addView: function(model, render) {
      // Insert a nested View into this View.
      var view = this.insertView('tbody', new root.BookView({ model: model }));

      // Only trigger render if it not inserted inside `beforeRender`.
      if (render !== false) {
        view.render();
      }
    },

    removeViews: function() {
      var views = this.getViews().each(function(view) {
        view.remove();
      });
    },

    beforeRender: function() {
      this.collection.each(function(model) {
        this.addView(model, false);
      }, this);
    },

    refresh: function() {
      return this.collection.fetch();
    },

    pull: function() {
      return this.collection.pull();
    },

    add: function() {
      var that = this;
      var book = new root.Book();
      var view = new root.AddBookView({ model: book });

      // Listen for sync event on book
      book.on('sync', function() {
        that.collection.add(book);
      });

      // Insert the view
      this.insertView(view);

      // Show the view
      view.show();

      // Listen for the hideen event and remove the view
      view.$el.on('hidden.bs.modal', function() {
        view.removeView();
      });
    },

    clear: function() {
      return this.collection.clear();
    }
  });
})(window, window._, window.$, window.Backbone, window.Kinvey);
